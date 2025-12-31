import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.models.Folder || mongoose.model("Folder", FolderSchema);
