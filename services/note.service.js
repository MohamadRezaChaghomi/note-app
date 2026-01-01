import { connectDB } from "@/lib/db";
import Note from "@/models/Note.model";
import Tag from "@/models/Tag.model";
import ChangeLog from "@/models/ChangeLog.model";

async function ensureTagIds(userId, tags = []) {
  if (!tags || tags.length === 0) return [];
  await connectDB();
  const tagIds = [];
  for (const t of tags) {
    if (!t) continue;
    // if already an ObjectId-like string, skip lookup
    // otherwise find or create by title
    const existing = await Tag.findOne({ userId, title: t }).lean();
    if (existing) {
      tagIds.push(existing._id);
    } else {
      const created = await Tag.create({ userId, title: t });
      tagIds.push(created._id);
    }
  }
  return tagIds;
}

export async function listNotes(userId, query = {}) {
  await connectDB();
  const filter = { userId };

  if (query.archived === "true") filter.isArchived = true;
  if (query.trashed === "true") filter.isTrashed = true;
  if (query.starred === "true") filter.isStarred = true;

  if (query.folderId) filter.folderId = query.folderId;

  if (query.search) {
    // text index
    filter.$text = { $search: query.search };
  }

  const notes = await Note.find(filter)
    .sort({ updatedAt: -1 })
    .populate('tagIds', 'title')
    .populate('folderId', 'title')
    .lean();

  // normalize response: map tagIds -> tags (titles) and folder
  const normalized = notes.map(n => ({
    ...n,
    tags: (n.tagIds || []).map(t => (t && t.title) ? t.title : String(t)),
    folder: n.folderId ? { _id: n.folderId._id, title: n.folderId.title } : null
  }));

  return normalized;
}

export async function getNote(userId, id) {
  await connectDB();
  const n = await Note.findOne({ _id: id, userId })
    .populate('tagIds', 'title')
    .populate('folderId', 'title')
    .lean();
  if (!n) return null;
  return {
    ...n,
    tags: (n.tagIds || []).map(t => (t && t.title) ? t.title : String(t)),
    folder: n.folderId ? { _id: n.folderId._id, title: n.folderId.title } : null
  };
}

export async function createNote(userId, payload) {
  await connectDB();
  // accept either tagIds or tags (names)
  let tagIds = payload.tagIds || [];
  if ((!tagIds || tagIds.length === 0) && payload.tags) {
    tagIds = await ensureTagIds(userId, payload.tags);
  }

  const note = await Note.create({
    userId,
    title: payload.title,
    description: payload.description || "",
    content: payload.content || "",
    color: payload.color || "",
    folderId: payload.folderId || null,
    tagIds: tagIds,
    isArchived: !!payload.isArchived,
    isTrashed: false,
    isStarred: !!payload.isStarred
  });
  await ChangeLog.create({ userId, entityType: "note", entityId: String(note._id), action: "create" });
  return (await getNote(userId, note._id));
}

export async function updateNote(userId, id, patch) {
  await connectDB();

  // handle tags by names
  if (patch.tags) {
    patch.tagIds = await ensureTagIds(userId, patch.tags);
    delete patch.tags;
  }

  const fields = {};
  if (typeof patch.title !== 'undefined') fields.title = patch.title;
  if (typeof patch.description !== 'undefined') fields.description = patch.description;
  if (typeof patch.content !== 'undefined') fields.content = patch.content;
  if (typeof patch.color !== 'undefined') fields.color = patch.color;
  if (typeof patch.folderId !== 'undefined') fields.folderId = patch.folderId;
  if (typeof patch.tagIds !== 'undefined') fields.tagIds = patch.tagIds;
  if (typeof patch.isArchived !== 'undefined') fields.isArchived = patch.isArchived;
  if (typeof patch.isTrashed !== 'undefined') fields.isTrashed = patch.isTrashed;
  if (typeof patch.isStarred !== 'undefined') fields.isStarred = patch.isStarred;

  const note = await Note.findOneAndUpdate(
    { _id: id, userId },
    { $set: fields },
    { new: true }
  ).lean();

  if (note) {
    await ChangeLog.create({ userId, entityType: "note", entityId: String(id), action: "update" });
    // return populated version
    return getNote(userId, id);
  }
  return null;
}

export async function trashNote(userId, id) {
  return updateNote(userId, id, { isTrashed: true });
}
export async function restoreNote(userId, id) {
  return updateNote(userId, id, { isTrashed: false });
}
export async function deleteNoteForever(userId, id) {
  await connectDB();
  const res = await Note.deleteOne({ _id: id, userId });
  if (res.deletedCount) await ChangeLog.create({ userId, entityType: "note", entityId: String(id), action: "delete" });
  return res.deletedCount === 1;
}
