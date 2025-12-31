import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, index: true, required: true },
    name: { type: String, default: "" },
    passwordHash: { type: String, default: "" },
    provider: { type: String, default: "credentials" } // credentials | google
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
