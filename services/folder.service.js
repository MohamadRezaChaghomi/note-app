import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder.model";
import ChangeLog from "@/models/ChangeLog.model";

export async function listFolders(userId) {
  await connectDB();
  return Folder.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function createFolder(userId, { title, description }) {
  await connectDB();
  const folder = await Folder.create({ userId, title, description: description || "" });
  await ChangeLog.create({ userId, entityType: "folder", entityId: String(folder._id), action: "create" });
  return folder;
}

export async function updateFolder(userId, id, patch) {
  await connectDB();
  const folder = await Folder.findOneAndUpdate(
    { _id: id, userId },
    { $set: { title: patch.title, description: patch.description || "" } },
    { new: true }
  ).lean();
  if (folder) await ChangeLog.create({ userId, entityType: "folder", entityId: String(id), action: "update" });
  return folder;
}

export async function deleteFolder(userId, id) {
  await connectDB();
  const res = await Folder.deleteOne({ _id: id, userId });
  if (res.deletedCount) await ChangeLog.create({ userId, entityType: "folder", entityId: String(id), action: "delete" });
  return res.deletedCount === 1;
}
