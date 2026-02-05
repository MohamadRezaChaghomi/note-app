import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    color: {
      type: String,
      default: "#3b82f6",
    },
    icon: {
      type: String,
      default: "folder",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual برای تعداد نت‌ها
FolderSchema.virtual("noteCount", {
  ref: "Note",
  localField: "_id",
  foreignField: "folderId",
  count: true,
});

const Folder = mongoose.models.Folder || mongoose.model("Folder", FolderSchema);
export default Folder;