import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      lowercase: true,
      maxlength: [50, "Tag name cannot exceed 50 characters"],
      index: true,
    },
    color: {
      type: String,
      default: "#6b7280",
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"],
    },
    icon: {
      type: String,
      default: "tag",
    },
    description: {
      type: String,
      default: "",
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUsed: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes
TagSchema.index({ userId: 1, name: 1 }, { unique: true });
TagSchema.index({ userId: 1, usageCount: -1 });
TagSchema.index({ userId: 1, lastUsed: -1 });
TagSchema.index({ userId: 1, isFavorite: 1 });

// Virtual for notes with this tag
TagSchema.virtual("notes", {
  ref: "Note",
  localField: "name",
  foreignField: "tags",
  match: function() { 
    return { userId: this.userId };
  },
});

// Virtual for note count
TagSchema.virtual("noteCount", {
  ref: "Note",
  localField: "name",
  foreignField: "tags",
  count: true,
});

// Static methods
TagSchema.statics.findByUser = function (userId, options = {}) {
  const query = this.find({ userId });

  if (options.search) {
    query.where({
      $or: [
        { name: { $regex: options.search, $options: "i" } },
        { description: { $regex: options.search, $options: "i" } },
      ],
    });
  }

  if (options.isFavorite !== undefined) {
    query.where("isFavorite").equals(options.isFavorite);
  }

  if (options.minUsageCount) {
    query.where("usageCount").gte(options.minUsageCount);
  }

  // Sort options
  const sortOptions = {};
  if (options.sortBy === "name") {
    sortOptions.name = options.sortOrder === "desc" ? -1 : 1;
  } else if (options.sortBy === "usage") {
    sortOptions.usageCount = options.sortOrder === "desc" ? -1 : 1;
  } else if (options.sortBy === "recent") {
    sortOptions.lastUsed = options.sortOrder === "desc" ? -1 : 1;
  } else {
    sortOptions.usageCount = -1;
  }

  return query.sort(sortOptions);
};

TagSchema.statics.getPopularTags = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ usageCount: -1, lastUsed: -1 })
    .limit(limit);
};

TagSchema.statics.incrementUsage = async function(userId, tagName) {
  return this.findOneAndUpdate(
    { userId, name: tagName },
    { 
      $inc: { usageCount: 1 },
      $set: { lastUsed: new Date() }
    },
    { new: true, upsert: false }
  );
};

TagSchema.statics.getOrCreate = async function(userId, tagName, options = {}) {
  const tag = await this.findOne({ userId, name: tagName.toLowerCase() });
  
  if (tag) {
    return tag;
  }
  
  return this.create({
    userId,
    name: tagName.toLowerCase(),
    color: options.color || "#6b7280",
    icon: options.icon || "tag",
    description: options.description || "",
  });
};

// Instance methods
TagSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

const Tag = mongoose.models.Tag || mongoose.model("Tag", TagSchema);

export default Tag;