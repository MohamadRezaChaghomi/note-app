import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder.model";
import Note from "@/models/Note.model";
import ChangeLog from "@/models/ChangeLog.model";
import { createSlug } from "@/lib/utils";

export async function listFolders(userId, options = {}) {
  await connectDB();

  const {
    parentId = null,
    withArchived = false,
    withNoteCount = true,
    search = "",
    limit = 100,
    offset = 0,
    sort = "order_asc",
    treeView = false,
  } = options;

  const query = { userId };

  if (parentId === null) {
    query.parentId = null;
  } else if (parentId !== undefined) {
    query.parentId = parentId;
  }

  if (!withArchived) {
    query.isArchived = false;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Sort options
  const [sortField, sortOrder] = sort.split("_");
  const sortOptions = { [sortField]: sortOrder === "desc" ? -1 : 1 };

  let foldersQuery = Folder.find(query)
    .sort(sortOptions)
    .skip(offset)
    .limit(limit);

  if (withNoteCount) {
    foldersQuery = foldersQuery.populate("noteCount");
  }

  if (treeView) {
    foldersQuery = foldersQuery.populate({
      path: "subfolders",
      populate: { path: "noteCount" },
    });
  }

  const [folders, total] = await Promise.all([
    foldersQuery.lean(),
    Folder.countDocuments(query),
  ]);

  // Transform folders
  let transformedFolders = folders.map((folder) => ({
    ...folder,
    noteCount: folder.noteCount || 0,
  }));

  // If tree view, recursively get subfolders
  if (treeView && (!parentId && parentId !== undefined)) {
    for (const folder of transformedFolders) {
      if (folder.subfolders) {
        folder.subfolders = folder.subfolders.map((sub) => ({
          ...sub,
          noteCount: sub.noteCount || 0,
        }));
      }
    }
  }

  return {
    folders: transformedFolders,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + folders.length < total,
    },
  };
}

export async function getFolder(userId, id) {
  await connectDB();

  const folder = await Folder.findOne({ _id: id, userId })
    .populate("noteCount")
    .populate({
      path: "subfolders",
      populate: { path: "noteCount" },
      match: { isArchived: false },
    })
    .lean();

  if (!folder) {
    return null;
  }

  // Get breadcrumb path
  const path = await Folder.getPath(id);

  return {
    ...folder,
    noteCount: folder.noteCount || 0,
    subfolders: (folder.subfolders || []).map((sub) => ({
      ...sub,
      noteCount: sub.noteCount || 0,
    })),
    path,
  };
}

export async function createFolder(userId, data) {
  await connectDB();

  // Validate required fields
  if (!data.title?.trim()) {
    throw new Error("Folder title is required");
  }

  // Check for duplicate folder name in same parent
  const existingFolder = await Folder.findOne({
    userId,
    parentId: data.parentId || null,
    title: data.title.trim(),
  });

  if (existingFolder) {
    throw new Error(`A folder named "${data.title}" already exists in this location`);
  }

  const folderData = {
    userId,
    title: data.title.trim(),
    description: data.description?.trim() || "",
    color: data.color || "#3b82f6",
    icon: data.icon || "folder",
    parentId: data.parentId || null,
    order: data.order,
    isDefault: data.isDefault || false,
    isProtected: data.isProtected || false,
    metadata: data.metadata || {},
  };

  const folder = await Folder.create(folderData);

  // Create default subfolders
  if (data.createDefaultSubfolders) {
    const defaultSubfolders = [
      { title: "Notes", icon: "folder", color: "#3b82f6" },
      { title: "Archive", icon: "archive", color: "#6b7280" },
      { title: "Trash", icon: "trash", color: "#ef4444" },
    ];

    for (const subfolder of defaultSubfolders) {
      await Folder.create({
        userId,
        parentId: folder._id,
        ...subfolder,
      });
    }
  }

  await ChangeLog.create({
    userId,
    entityType: "folder",
    entityId: folder._id,
    action: "create",
    changes: Object.keys(folderData).map((key) => ({
      field: key,
      oldValue: null,
      newValue: folderData[key],
    })),
  });

  return await getFolder(userId, folder._id);
}

export async function updateFolder(userId, id, updates) {
  await connectDB();

  // Get current folder
  const oldFolder = await Folder.findOne({ _id: id, userId }).lean();
  if (!oldFolder) {
    return null;
  }

  // Prepare update data
  const updateData = {};
  const changes = [];

  // Track changes for each field
  const allowedFields = [
    "title",
    "description",
    "color",
    "icon",
    "parentId",
    "order",
    "isArchived",
    "isProtected",
    "metadata",
  ];

  allowedFields.forEach((field) => {
    if (field in updates) {
      const newValue = updates[field];
      const oldValue = oldFolder[field];

      // Compare values
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        updateData[field] = newValue;
        changes.push({
          field,
          oldValue,
          newValue,
        });
      }
    }
  });

  // If title is changing, check for duplicates
  if (updates.title && updates.title !== oldFolder.title) {
    const duplicate = await Folder.findOne({
      userId,
      parentId: updates.parentId !== undefined ? updates.parentId : oldFolder.parentId,
      title: updates.title.trim(),
      _id: { $ne: id },
    });

    if (duplicate) {
      throw new Error(`A folder named "${updates.title}" already exists in this location`);
    }
  }

  // Update folder
  const folder = await Folder.findOneAndUpdate(
    { _id: id, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  if (!folder) {
    return null;
  }

  // Log changes
  if (changes.length > 0) {
    await ChangeLog.create({
      userId,
      entityType: "folder",
      entityId: id,
      action: "update",
      changes,
    });
  }

  return await getFolder(userId, id);
}

export async function deleteFolder(userId, id, options = {}) {
  await connectDB();

  const { force = false, moveNotesTo = null } = options;

  const folder = await Folder.findOne({ _id: id, userId });
  if (!folder) {
    return false;
  }

  // Check if folder has notes
  const noteCount = await Note.countDocuments({ folderId: id, isTrashed: false });
  
  if (noteCount > 0) {
    if (force) {
      // Permanently delete all notes in this folder
      await Note.deleteMany({ folderId: id });
    } else if (moveNotesTo) {
      // Move notes to another folder
      const targetFolder = await Folder.findOne({ _id: moveNotesTo, userId });
      if (!targetFolder) {
        throw new Error("Target folder not found");
      }
      
      await Note.updateMany(
        { folderId: id },
        { $set: { folderId: moveNotesTo } }
      );
    } else {
      throw new Error(
        `Folder contains ${noteCount} notes. Use force=true to delete them or specify moveNotesTo.`
      );
    }
  }

  // Handle subfolders
  const subfolders = await Folder.find({ parentId: id });
  
  if (force) {
    // Recursively delete all subfolders
    for (const subfolder of subfolders) {
      await deleteFolder(userId, subfolder._id, { force: true });
    }
    
    // Delete the folder
    const result = await Folder.deleteOne({ _id: id, userId });
    
    await ChangeLog.create({
      userId,
      entityType: "folder",
      entityId: id,
      action: "delete",
      data: JSON.stringify(folder),
    });
    
    return result.deletedCount === 1;
  } else {
    // Archive folder and its subfolders
    await folder.archiveWithChildren();
    return true;
  }
}

export async function getFolderTree(userId) {
  await connectDB();
  return await Folder.getTree(userId);
}

export async function getFolderStats(userId) {
  await connectDB();

  const [totalFolders, archivedFolders, foldersWithNotes, totalNotes] = await Promise.all([
    Folder.countDocuments({ userId, isArchived: false }),
    Folder.countDocuments({ userId, isArchived: true }),
    Folder.aggregate([
      { $match: { userId, isArchived: false } },
      {
        $lookup: {
          from: "notes",
          let: { folderId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$folderId", "$$folderId"] },
                    { $eq: ["$isTrashed", false] },
                  ],
                },
              },
            },
            { $count: "count" },
          ],
          as: "notes",
        },
      },
      {
        $match: {
          "notes.count": { $gt: 0 },
        },
      },
      { $count: "count" },
    ]),
    Note.countDocuments({ userId, isTrashed: false }),
  ]);

  // Get folder size distribution
  const sizeDistribution = await Folder.aggregate([
    { $match: { userId, isArchived: false } },
    {
      $lookup: {
        from: "notes",
        let: { folderId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$folderId", "$$folderId"] },
                  { $eq: ["$isTrashed", false] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        as: "notes",
      },
    },
    {
      $project: {
        title: 1,
        noteCount: { $arrayElemAt: ["$notes.count", 0] },
      },
    },
    {
      $bucket: {
        groupBy: "$noteCount",
        boundaries: [0, 1, 5, 10, 20, 50, 100],
        default: "100+",
        output: {
          count: { $sum: 1 },
          folders: { $push: { title: "$title", count: "$noteCount" } },
        },
      },
    },
  ]);

  return {
    total: totalFolders,
    archived: archivedFolders,
    foldersWithNotes: foldersWithNotes[0]?.count || 0,
    emptyFolders: totalFolders - (foldersWithNotes[0]?.count || 0),
    totalNotes,
    sizeDistribution,
  };
}

export async function reorderFolders(userId, folderIds) {
  await connectDB();

  const updates = folderIds.map((folderId, index) => ({
    updateOne: {
      filter: { _id: folderId, userId },
      update: { $set: { order: index } },
    },
  }));

  await Folder.bulkWrite(updates);

  await ChangeLog.create({
    userId,
    entityType: "folder",
    action: "reorder",
    changes: folderIds.map((id, index) => ({
      field: "order",
      folderId: id,
      newValue: index,
    })),
  });

  return true;
}

export async function duplicateFolder(userId, folderId, newParentId = null) {
  await connectDB();

  const originalFolder = await Folder.findOne({ _id: folderId, userId });
  if (!originalFolder) {
    throw new Error("Folder not found");
  }

  // Create duplicate folder
  const duplicateData = {
    userId,
    title: `${originalFolder.title} (Copy)`,
    description: originalFolder.description,
    color: originalFolder.color,
    icon: originalFolder.icon,
    parentId: newParentId || originalFolder.parentId,
    order: originalFolder.order + 1,
    isProtected: originalFolder.isProtected,
    metadata: { ...originalFolder.metadata, duplicatedFrom: folderId },
  };

  const duplicateFolder = await Folder.create(duplicateData);

  // Duplicate subfolders recursively
  const subfolders = await Folder.find({ parentId: folderId, isArchived: false });
  
  for (const subfolder of subfolders) {
    await duplicateFolder(userId, subfolder._id, duplicateFolder._id);
  }

  await ChangeLog.create({
    userId,
    entityType: "folder",
    entityId: duplicateFolder._id,
    action: "duplicate",
    sourceFolderId: folderId,
  });

  return await getFolder(userId, duplicateFolder._id);
}

export async function searchFolders(userId, query, options = {}) {
  await connectDB();

  const {
    limit = 20,
    offset = 0,
    includeArchived = false,
    includeNotes = false,
  } = options;

  const searchQuery = {
    userId,
    $text: { $search: query },
  };

  if (!includeArchived) {
    searchQuery.isArchived = false;
  }

  const [folders, total] = await Promise.all([
    Folder.find(searchQuery)
      .select("title description color icon parentId path")
      .skip(offset)
      .limit(limit)
      .sort({ score: { $meta: "textScore" } })
      .lean(),
    Folder.countDocuments(searchQuery),
  ]);

  // Get note counts if requested
  if (includeNotes && folders.length > 0) {
    const folderIds = folders.map((f) => f._id);
    const noteCounts = await Note.aggregate([
      {
        $match: {
          folderId: { $in: folderIds },
          isTrashed: false,
        },
      },
      {
        $group: {
          _id: "$folderId",
          count: { $sum: 1 },
        },
      },
    ]);

    const noteCountMap = noteCounts.reduce((map, item) => {
      map[item._id] = item.count;
      return map;
    }, {});

    folders.forEach((folder) => {
      folder.noteCount = noteCountMap[folder._id] || 0;
    });
  }

  return {
    folders,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + folders.length < total,
    },
  };
}