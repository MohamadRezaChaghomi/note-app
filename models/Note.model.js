import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    content: { type: String, default: "" },
    color: { type: String, default: "" },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    tagIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],

    isArchived: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false }
  },
  { timestamps: true }
);

NoteSchema.index({ title: "text", content: "text" });

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
