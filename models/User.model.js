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
    required: function() { 
      // فقط برای کاربران credentials الزامی است
      return this.provider === "credentials" && !this.oauthProviders?.length;
    },
    select: false
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
    enum: ["credentials", "google", "multiple"],
    default: "credentials"
  },
  oauthProviders: [{
    type: String,
    enum: ["google"],
    default: []
  }],
  emailVerified: {
    type: Date,
    default: null
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
userSchema.index({ email: 1 }, { unique: true });

// Method to check if user can use password reset
userSchema.methods.canUsePassword = function() {
  return this.provider === "credentials" || 
         this.password || 
         (this.oauthProviders?.length > 0 && this.provider !== "multiple");
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;