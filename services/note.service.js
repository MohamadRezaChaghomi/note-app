import { connectDB } from "@/lib/db";
import Note from "@/models/Note.model";
import Folder from "@/models/Folder.model";
import ChangeLog from "@/models/ChangeLog.model";
import { createSlug } from "@/lib/utils";

export async function listNotes(userId, query = {}) {
  await connectDB();
  
  const {
    page = 1,
    limit = 12,
    sort = "updatedAt_desc",
    search = "",
    status = "all",
    folderId = null,
    tags = [],
    priority = null,
    dateRange = null,
    withTrashed = false,
    pinnedFirst = false
  } = query;

  // Build filter
  const filter = { userId };
  
  // Handle trashed notes
  if (!withTrashed) {
    filter.isTrashed = false;
  }
  
  // Status filtering
  switch (status) {
    case "starred":
      filter.isStarred = true;
      filter.isArchived = false;
      break;
    case "archived":
      filter.isArchived = true;
      break;
    case "trashed":
      filter.isTrashed = true;
      break;
    case "pinned":
      filter.pinnedAt = { $ne: null };
      break;
    case "due":
      filter.dueDate = { $ne: null, $gte: new Date() };
      break;
    case "overdue":
      filter.dueDate = { $lt: new Date() };
      break;
    default:
      // Active notes
      filter.isArchived = false;
  }
  
  // Additional filters
  if (folderId) filter.folderId = folderId;
  if (priority) filter.priority = priority;
  if (tags && tags.length > 0) {
    if (typeof tags === 'string') {
      filter.tags = { $in: tags.split(',') };
    } else if (Array.isArray(tags)) {
      filter.tags = { $in: tags };
    }
  }
  
  // Date range filter
  if (dateRange) {
    const [start, end] = dateRange.split(',');
    filter.updatedAt = {};
    if (start) filter.updatedAt.$gte = new Date(start);
    if (end) filter.updatedAt.$lte = new Date(end);
  }
  
  // Search
  if (search) {
    // Use text search if available, otherwise regex
    const hasTextIndex = await Note.collection.indexExists('title_text_content_text_description_text_tags_text');
    
    if (hasTextIndex) {
      filter.$text = { $search: search };
    } else {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
  }

  // Sort options
  let sortOptions = {};
  if (pinnedFirst) {
    sortOptions.pinnedAt = -1;
  }
  
  const [sortField, sortOrder] = sort.split('_');
  sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;
  
  // If no specific sort, add default
  if (!sortOptions.updatedAt) {
    sortOptions.updatedAt = -1;
  }

  // Pagination
  const skip = (page - 1) * limit;
  
  const [notes, total] = await Promise.all([
    Note.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('folderId', 'title color icon')
      .populate('sharedWith.userId', 'name email avatar')
      .lean(),
    Note.countDocuments(filter)
  ]);

  // Transform notes
  const transformedNotes = notes.map(note => ({
    ...note,
    folder: note.folderId,
    folderId: note.folderId?._id,
    isPinned: !!note.pinnedAt,
    isDueSoon: note.dueDate && 
      new Date(note.dueDate) > new Date() && 
      new Date(note.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isOverdue: note.dueDate && new Date(note.dueDate) < new Date(),
    sharedCount: note.sharedWith?.length || 0
  }));

  return {
    notes: transformedNotes,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    },
    filters: {
      status,
      folderId,
      tags,
      priority,
      search
    }
  };
}

export async function getNote(userId, id) {
  await connectDB();
  
  if (!id) {
    throw new Error("Note ID is required");
  }

  const note = await Note.findOne({ _id: id, userId })
    .populate('folderId', 'title color icon')
    .populate('sharedWith.userId', 'name email avatar role')
    .lean();
    
  if (!note) {
    return null;
  }
  
  // Increment view count
  await Note.updateOne(
    { _id: id }, 
    { 
      $inc: { viewCount: 1 },
      $set: { lastViewedAt: new Date() }
    }
  );
  
  // Transform note
  return {
    ...note,
    folder: note.folderId,
    folderId: note.folderId?._id,
    isPinned: !!note.pinnedAt,
    isDueSoon: note.dueDate && 
      new Date(note.dueDate) > new Date() && 
      new Date(note.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isOverdue: note.dueDate && new Date(note.dueDate) < new Date(),
    sharedUsers: note.sharedWith?.map(share => ({
      user: share.userId,
      permission: share.permission,
      invitedAt: share.invitedAt
    })) || []
  };
}

export async function createNote(userId, payload) {
  await connectDB();
  
  // Validate required fields
  if (!payload.folderId) {
    throw new Error("Folder is required");
  }

  // Verify folder exists and belongs to user
  const folder = await Folder.findOne({ _id: payload.folderId, userId });
  if (!folder) {
    throw new Error("Folder not found or access denied");
  }

  const noteData = {
    userId,
    title: payload.title?.trim() || "Untitled Note",
    description: payload.description?.trim() || "",
    content: payload.content?.trim() || "",
    color: payload.color || "#3b82f6",
    folderId: payload.folderId,
    tags: payload.tags?.filter(tag => tag.trim()).map(tag => tag.toLowerCase()) || [],
    priority: payload.priority || "medium",
    dueDate: payload.dueDate || null,
    reminderAt: payload.reminderAt || null,
    coverImage: payload.coverImage || null,
    isStarred: payload.isStarred || false,
    isArchived: payload.isArchived || false,
    isLocked: payload.isLocked || false,
    pinnedAt: payload.pinned ? new Date() : null
  };

  const note = await Note.create(noteData);
  
  // Log the creation
  await ChangeLog.create({
    userId,
    entityType: "note",
    entityId: note._id,
    action: "create",
    changes: Object.keys(noteData).map(key => ({
      field: key,
      oldValue: null,
      newValue: noteData[key]
    }))
  });
  
  // Update folder's note count
  await Folder.updateOne(
    { _id: payload.folderId },
    { $inc: { noteCount: 1 } }
  );
  
  return await getNote(userId, note._id);
}

export async function updateNote(userId, id, patch) {
  await connectDB();

  // Get current note
  const oldNote = await Note.findOne({ _id: id, userId }).lean();
  if (!oldNote) {
    return null;
  }

  // Prepare update data
  const updateData = {};
  const changes = [];

  // Track changes for each field
  const fields = [
    'title', 'description', 'content', 'color', 'folderId',
    'tags', 'priority', 'dueDate', 'reminderAt', 'coverImage',
    'isStarred', 'isArchived', 'isLocked', 'pinnedAt'
  ];

  fields.forEach(field => {
    if (field in patch) {
      const newValue = patch[field];
      const oldValue = oldNote[field];
      
      // Compare values
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        updateData[field] = newValue;
        changes.push({
          field,
          oldValue,
          newValue
        });
      }
    }
  });

  // Handle folder change
  if (updateData.folderId && updateData.folderId !== oldNote.folderId) {
    // Update both folders' note counts
    await Promise.all([
      Folder.updateOne(
        { _id: oldNote.folderId },
        { $inc: { noteCount: -1 } }
      ),
      Folder.updateOne(
        { _id: updateData.folderId },
        { $inc: { noteCount: 1 } }
      )
    ]);
  }

  // Handle pinned status
  if ('pinned' in patch) {
    updateData.pinnedAt = patch.pinned ? new Date() : null;
  }

  // Update note
  const note = await Note.findOneAndUpdate(
    { _id: id, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (note && changes.length > 0) {
    // Log the changes
    await ChangeLog.create({
      userId,
      entityType: "note",
      entityId: id,
      action: "update",
      changes
    });
  }

  return note ? await getNote(userId, id) : null;
}

export async function trashNote(userId, id) {
  await connectDB();
  
  const note = await Note.findOne({ _id: id, userId });
  if (!note) {
    return null;
  }

  const result = await Note.findOneAndUpdate(
    { _id: id, userId },
    { 
      $set: { 
        isTrashed: true,
        trashedAt: new Date(),
        pinnedAt: null // Unpin when trashed
      }
    },
    { new: true }
  );

  if (result) {
    await ChangeLog.create({
      userId,
      entityType: "note",
      entityId: id,
      action: "trash"
    });
  }

  return result;
}

export async function restoreNote(userId, id) {
  await connectDB();
  
  const note = await Note.findOne({ _id: id, userId, isTrashed: true });
  if (!note) {
    return null;
  }

  const result = await Note.findOneAndUpdate(
    { _id: id, userId },
    { 
      $set: { 
        isTrashed: false,
        trashedAt: null
      }
    },
    { new: true }
  );

  if (result) {
    await ChangeLog.create({
      userId,
      entityType: "note",
      entityId: id,
      action: "restore"
    });
  }

  return result;
}

export async function deleteNoteForever(userId, id) {
  await connectDB();
  
  const note = await Note.findOne({ _id: id, userId });
  if (!note) {
    return false;
  }

  // Log before deletion
  await ChangeLog.create({
    userId,
    entityType: "note",
    entityId: id,
    action: "delete",
    data: JSON.stringify(note)
  });

  // Update folder note count
  await Folder.updateOne(
    { _id: note.folderId },
    { $inc: { noteCount: -1 } }
  );

  const result = await Note.deleteOne({ _id: id, userId });
  return result.deletedCount === 1;
}

export async function bulkUpdateNotes(userId, noteIds, updates) {
  await connectDB();
  
  if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
    throw new Error("No notes selected");
  }

  // Get current notes for logging
  const oldNotes = await Note.find({ _id: { $in: noteIds }, userId }).lean();
  
  // Prepare update
  const updateData = {};
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      updateData[key] = updates[key];
    }
  });

  // Handle pinned status
  if ('pinned' in updates) {
    updateData.pinnedAt = updates.pinned ? new Date() : null;
  }

  const result = await Note.updateMany(
    { _id: { $in: noteIds }, userId },
    { $set: updateData }
  );
  
  // Log bulk update
  if (result.modifiedCount > 0) {
    await ChangeLog.create({
      userId,
      entityType: "note",
      action: "bulk_update",
      changes: Object.keys(updates).map(key => ({
        field: key,
        oldValue: "multiple",
        newValue: updates[key]
      })),
      count: result.modifiedCount
    });
  }
  
  return result.modifiedCount;
}

export async function shareNote(userId, noteId, shareData) {
  await connectDB();
  
  const note = await Note.findOne({ _id: noteId, userId });
  if (!note) {
    throw new Error("Note not found");
  }

  const updateResult = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { $set: { sharedWith: shareData } },
    { new: true }
  );

  await ChangeLog.create({
    userId,
    entityType: "note",
    entityId: noteId,
    action: "share_update"
  });

  return updateResult;
}

export async function duplicateNote(userId, noteId, newFolderId = null) {
  await connectDB();
  
  const originalNote = await Note.findOne({ _id: noteId, userId });
  if (!originalNote) {
    throw new Error("Note not found");
  }

  const duplicateData = {
    ...originalNote.toObject(),
    _id: undefined,
    title: `${originalNote.title} (Copy)`,
    isStarred: false,
    isArchived: false,
    isTrashed: false,
    pinnedAt: null,
    viewCount: 0,
    sharedWith: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (newFolderId) {
    duplicateData.folderId = newFolderId;
  }

  const duplicate = await Note.create(duplicateData);
  
  // Update folder note count
  await Folder.updateOne(
    { _id: duplicateData.folderId },
    { $inc: { noteCount: 1 } }
  );
  
  await ChangeLog.create({
    userId,
    entityType: "note",
    entityId: duplicate._id,
    action: "duplicate",
    sourceNoteId: noteId
  });

  return await getNote(userId, duplicate._id);
}

export async function exportNote(userId, noteId, format = "json") {
  await connectDB();
  
  const note = await Note.findOne({ _id: noteId, userId }).lean();
  if (!note) {
    throw new Error("Note not found");
  }

  switch (format) {
    case "json":
      return JSON.stringify(note, null, 2);
    case "txt":
      return `Title: ${note.title}\n\nDescription: ${note.description}\n\nContent:\n${note.content}\n\nTags: ${note.tags.join(", ")}\n\nCreated: ${note.createdAt}\nUpdated: ${note.updatedAt}`;
    case "md":
      return `# ${note.title}\n\n${note.description}\n\n${note.content}\n\n---\n*Tags: ${note.tags.join(", ")}*\n*Created: ${note.createdAt}*\n*Updated: ${note.updatedAt}*`;
    default:
      throw new Error("Unsupported export format");
  }
}