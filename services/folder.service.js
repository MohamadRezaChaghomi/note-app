import { connectDB } from "@/lib/db";
import Folder from "@/models/Folder.model";
import Note from "@/models/Note.model";
import mongoose from "mongoose";

export async function listFolders(userId) {
  await connectDB();

  const folders = await Folder.find({ userId })
    .sort({ order: 1, createdAt: -1 })
    .populate("noteCount")
    .lean();

  return folders.map(folder => ({
    ...folder,
    noteCount: folder.noteCount || 0,
  }));
}

export async function getFolder(userId, id) {
  await connectDB();

  // Ensure id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const folder = await Folder.findOne({ _id: new mongoose.Types.ObjectId(id), userId })
    .populate("noteCount")
    .lean();

  if (!folder) return null;

  return {
    ...folder,
    noteCount: folder.noteCount || 0,
  };
}

export async function createFolder(userId, data) {
  await connectDB();

  // چک کردن تکراری نبودن نام فولدر
  const existingFolder = await Folder.findOne({
    userId,
    title: data.title.trim(),
  });

  if (existingFolder) {
    throw new Error(`A folder named "${data.title}" already exists`);
  }

  const folderData = {
    userId,
    title: data.title.trim(),
    description: data.description?.trim() || "",
    color: data.color || "#3b82f6",
    icon: data.icon || "folder",
  };

  const folder = await Folder.create(folderData);
  return await getFolder(userId, folder._id);
}

export async function updateFolder(userId, id, updates) {
  await connectDB();

  // Ensure id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  const folder = await Folder.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id), userId },
    { $set: updates },
    { new: true, runValidators: true }
  ).lean();

  if (!folder) return null;

  return await getFolder(userId, id);
}

export async function deleteFolder(userId, id) {
  await connectDB();

  // Ensure id is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  const objectId = new mongoose.Types.ObjectId(id);

  // چک کردن اینکه فولدر خالی است
  const noteCount = await Note.countDocuments({ folderId: objectId });
  if (noteCount > 0) {
    throw new Error(`Cannot delete folder with ${noteCount} notes`);
  }

  const result = await Folder.deleteOne({ _id: objectId, userId });
  return result.deletedCount === 1;
}

export async function getFolderNotes(userId, folderId) {
  await connectDB();

  // Ensure folderId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(folderId)) {
    return [];
  }

  const notes = await Note.find({ 
    folderId: new mongoose.Types.ObjectId(folderId), 
    userId 
  })
    .select("_id title description content createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  return notes || [];
}