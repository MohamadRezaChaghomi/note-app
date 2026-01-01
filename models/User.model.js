import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() { return this.provider === "credentials"; }
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  image: String,
  provider: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials"
  },
  
  // Security fields
  loginAttempts: {
    type: Number,
    default: 0,
    select: false
  },
  lockUntil: {
    type: Date,
    select: false
  },
  
  // Password reset
  resetCode: {
    type: String,
    select: false
  },
  resetCodeExpires: {
    type: Date,
    select: false
  },
  
  // Activity tracking
  lastLogin: Date,
  lastActive: Date,
  
  // Settings
  settings: {
    theme: {
      type: String,
      enum: ["light", "dark", "system"],
      default: "system"
    },
    language: {
      type: String,
      default: "en"
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ resetCodeExpires: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;