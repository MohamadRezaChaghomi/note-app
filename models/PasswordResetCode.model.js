import mongoose from "mongoose";

const PasswordResetCodeSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      index: true, 
      required: true 
    },
    email: { 
      type: String, 
      index: true, 
      required: true 
    },
    code: { 
      type: String, 
      index: true, 
      required: true 
    },
    expiresAt: { 
      type: Date, 
      required: true 
    },
    attempts: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// TTL index برای حذف خودکار کدهای منقضی شده
PasswordResetCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PasswordResetCode ||
  mongoose.model("PasswordResetCode", PasswordResetCodeSchema);
