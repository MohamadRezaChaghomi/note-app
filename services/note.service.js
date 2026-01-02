import { connectDB } from "@/lib/db";
import Note from "@/models/Note.model";
import ChangeLog from "@/models/ChangeLog.model";

export async function listNotes(userId, query = {}) {
  await connectDB();
  const filter = { userId, isTrashed: false };

  if (query.archived === "true") filter.isArchived = true;
  if (query.folderId) filter.folderId = query.folderId;

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const notes = await Note.find(filter)
    .sort({ updatedAt: -1 })
    .populate('folderId', 'title')
    .lean();

  return notes;
}

export async function getNote(userId, id) {
  await connectDB();
  const n = await Note.findOne({ _id: id, userId })
    .populate('folderId', 'title')
    .lean();
  if (!n) return null;
  return n;
}

export async function createNote(userId, payload) {
  await connectDB();
  
  if (!payload.folderId) {
    throw new Error("Folder is required");
  }

  const note = await Note.create({
    userId,
    title: payload.title || "Untitled",
    description: payload.description || "",
    content: payload.content || "",
    color: payload.color || "#FFFFFF",
    folderId: payload.folderId,
    isArchived: false,
    isTrashed: false,
    isStarred: false
  });
  
  await ChangeLog.create({ userId, entityType: "note", entityId: String(note._id), action: "create" });
  return (await getNote(userId, note._id));
}

export async function updateNote(userId, id, patch) {
  await connectDB();

  const fields = {};
  if (typeof patch.title !== 'undefined') fields.title = patch.title;
  if (typeof patch.description !== 'undefined') fields.description = patch.description;
  if (typeof patch.content !== 'undefined') fields.content = patch.content;
  if (typeof patch.color !== 'undefined') fields.color = patch.color;
  if (typeof patch.folderId !== 'undefined') fields.folderId = patch.folderId;
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
