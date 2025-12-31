import { connectDB } from "@/lib/db";
import Note from "@/models/Note.model";
import ChangeLog from "@/models/ChangeLog.model";

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
    .lean();

  return notes;
}

export async function getNote(userId, id) {
  await connectDB();
  return Note.findOne({ _id: id, userId }).lean();
}

export async function createNote(userId, payload) {
  await connectDB();
  const note = await Note.create({
    userId,
    title: payload.title,
    content: payload.content || "",
    folderId: payload.folderId || null,
    tagIds: payload.tagIds || [],
    isArchived: !!payload.isArchived,
    isTrashed: false,
    isStarred: !!payload.isStarred
  });
  await ChangeLog.create({ userId, entityType: "note", entityId: String(note._id), action: "create" });
  return note.toObject();
}

export async function updateNote(userId, id, patch) {
  await connectDB();
  const note = await Note.findOneAndUpdate(
    { _id: id, userId },
    { $set: patch },
    { new: true }
  ).lean();

  if (note) await ChangeLog.create({ userId, entityType: "note", entityId: String(id), action: "update" });
  return note;
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
