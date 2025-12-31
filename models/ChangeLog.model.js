import mongoose from "mongoose";

const ChangeLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    entityType: { type: String, required: true }, // note/folder/tag
    entityId: { type: String, required: true },
    action: { type: String, required: true }, // create/update/delete
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.models.ChangeLog || mongoose.model("ChangeLog", ChangeLogSchema);
