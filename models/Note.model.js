import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      index: true, 
      required: [true, "User ID is required"] 
    },
    title: { 
      type: String, 
      required: [true, "Title is required"], 
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
      index: true
    },
    description: { 
      type: String, 
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
      index: true
    },
    content: { 
      type: String, 
      default: "",
      index: true
    },
    color: { 
      type: String, 
      default: "#3b82f6",
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"]
    },
    folderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Folder", 
      required: [true, "Folder is required"],
      index: true
    },
    
    // Status flags
    isArchived: { 
      type: Boolean, 
      default: false,
      index: true
    },
    isTrashed: { 
      type: Boolean, 
      default: false,
      index: true
    },
    isStarred: { 
      type: Boolean, 
      default: false,
      index: true
    },
    isLocked: { 
      type: Boolean, 
      default: false 
    },
    
    // Metadata
    tags: [{ 
      type: String,
      trim: true,
      lowercase: true,
      index: true
    }],
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true
    },
    dueDate: {
      type: Date,
      index: true
    },
    
    // Versioning
    version: {
      type: Number,
      default: 1
    },
    
    // Sharing
    sharedWith: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      permission: {
        type: String,
        enum: ["view", "edit"],
        default: "view"
      },
      invitedAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Analytics
    viewCount: {
      type: Number,
      default: 0
    },
    lastViewedAt: {
      type: Date
    },
    
    // Trash metadata
    trashedAt: {
      type: Date
    },
    
    // Pin position
    pinnedAt: {
      type: Date
    },
    
    // Reminder
    reminderAt: {
      type: Date,
      index: true
    },
    
    // Cover image
    coverImage: {
      url: String,
      alt: String
    },
    
    // SEO metadata
    slug: {
      type: String,
      unique: true,
      sparse: true
    },
    
    // Custom metadata
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { 
    timestamps: true,
    toJSON: { 
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        delete ret.metadata;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Compound indexes for better performance
NoteSchema.index({ userId: 1, isTrashed: 1, isArchived: 1, isStarred: 1 });
NoteSchema.index({ userId: 1, folderId: 1, updatedAt: -1 });
NoteSchema.index({ userId: 1, tags: 1, updatedAt: -1 });
NoteSchema.index({ userId: 1, priority: 1, updatedAt: -1 });
NoteSchema.index({ userId: 1, dueDate: 1, isTrashed: 1 });
NoteSchema.index({ userId: 1, reminderAt: 1, isTrashed: 1 });

// Text search index
NoteSchema.index({ 
  title: "text", 
  description: "text", 
  content: "text",
  tags: "text" 
});

// Virtuals
NoteSchema.virtual('isPinned').get(function() {
  return !!this.pinnedAt;
});

NoteSchema.virtual('isDueSoon').get(function() {
  if (!this.dueDate) return false;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays >= 0;
});

NoteSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate) return false;
  return new Date(this.dueDate) < new Date();
});

NoteSchema.virtual('formattedDueDate').get(function() {
  if (!this.dueDate) return null;
  return this.dueDate.toISOString().split('T')[0];
});

NoteSchema.virtual('timeToRead').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Middleware
NoteSchema.pre('save', function() {
  // Auto-generate slug if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  
  // Increment version on content/title changes
  if (this.isModified('content') || this.isModified('title')) {
    this.version += 1;
  }
});

NoteSchema.pre('find', function() {
  this.where({ isTrashed: false });
});

NoteSchema.pre('findOne', function() {
  this.where({ isTrashed: false });
});

// Static methods
NoteSchema.statics.findByUser = function(userId, options = {}) {
  const query = this.find({ userId });
  
  if (options.folderId) {
    query.where('folderId').equals(options.folderId);
  }
  
  if (options.isArchived !== undefined) {
    query.where('isArchived').equals(options.isArchived);
  }
  
  if (options.isStarred !== undefined) {
    query.where('isStarred').equals(options.isStarred);
  }
  
  if (options.tags && options.tags.length > 0) {
    query.where('tags').in(options.tags);
  }
  
  if (options.priority) {
    query.where('priority').equals(options.priority);
  }
  
  return query;
};

NoteSchema.statics.search = function(userId, searchTerm) {
  return this.find(
    { 
      userId,
      $text: { $search: searchTerm }
    },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
};

// Instance methods
NoteSchema.methods.toPublicJSON = function() {
  const obj = this.toJSON();
  
  // Remove sensitive fields
  delete obj.userId;
  delete obj.sharedWith;
  delete obj.metadata;
  delete obj.isLocked;
  
  return obj;
};

NoteSchema.methods.shareWithUser = function(userId, permission = "view") {
  if (!this.sharedWith.some(share => share.userId.equals(userId))) {
    this.sharedWith.push({
      userId,
      permission,
      invitedAt: new Date()
    });
  }
  return this.save();
};

NoteSchema.methods.removeShare = function(userId) {
  this.sharedWith = this.sharedWith.filter(share => !share.userId.equals(userId));
  return this.save();
};

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);
export default Note;