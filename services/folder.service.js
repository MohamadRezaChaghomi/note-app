import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder.model";
import Note from "@/models/Note.model";
import ChangeLog from "@/models/ChangeLog.model";

export async function listFolders(userId) {
  await connectDB();
  return Folder.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getFolder(userId, id) {
  await connectDB();
  return Folder.findOne({ _id: id, userId }).lean();
}

export async function createFolder(userId, { title }) {
  if (!title || !title.trim()) {
    throw new Error("Folder title is required");
  }
  
  await connectDB();
  const folder = await Folder.create({ userId, title: title.trim(), description: "" });
  await ChangeLog.create({ userId, entityType: "folder", entityId: String(folder._id), action: "create" });
  return folder;
}

export async function updateFolder(userId, id, patch) {
  await connectDB();
  
  const updateData = {};
  if (typeof patch.title !== 'undefined') {
    if (!patch.title.trim()) {
      throw new Error("Folder title is required");
    }
    updateData.title = patch.title.trim();
  }
  if (typeof patch.description !== 'undefined') {
    updateData.description = patch.description || "";
  }
  
  const folder = await Folder.findOneAndUpdate(
    { _id: id, userId },
    { $set: updateData },
    { new: true }
  ).lean();
  
  if (folder) {
    await ChangeLog.create({ userId, entityType: "folder", entityId: String(id), action: "update" });
  }
  return folder;
}

export async function deleteFolder(userId, id) {
  await connectDB();
  
  // حذف تمام نت‌های داخل فولدر
  await Note.deleteMany({ folderId: id, userId });

  const res = await Folder.deleteOne({ _id: id, userId });
  if (res.deletedCount) {
    await ChangeLog.create({ userId, entityType: "folder", entityId: String(id), action: "delete" });
  }
  return res.deletedCount === 1;
}

export async function getNoteCountByFolder(userId, folderId) {
  await connectDB();
  const count = await Note.countDocuments({ folderId, userId, isTrashed: false });
  return count;
}
