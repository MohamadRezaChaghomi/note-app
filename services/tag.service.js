import { connectDB } from "@/lib/db";
import Tag from "@/models/Tag.model";
import ChangeLog from "@/models/ChangeLog.model";

export async function listTags(userId) {
  await connectDB();
  return Tag.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function createTag(userId, { title, description }) {
  await connectDB();
  const tag = await Tag.create({ userId, title, description: description || "" });
  await ChangeLog.create({ userId, entityType: "tag", entityId: String(tag._id), action: "create" });
  return tag;
}

export async function updateTag(userId, id, patch) {
  await connectDB();
  const tag = await Tag.findOneAndUpdate(
    { _id: id, userId },
    { $set: { title: patch.title, description: patch.description || "" } },
    { new: true }
  ).lean();
  if (tag) await ChangeLog.create({ userId, entityType: "tag", entityId: String(id), action: "update" });
  return tag;
}

export async function deleteTag(userId, id) {
  await connectDB();
  const res = await Tag.deleteOne({ _id: id, userId });
  if (res.deletedCount) await ChangeLog.create({ userId, entityType: "tag", entityId: String(id), action: "delete" });
  return res.deletedCount === 1;
}
