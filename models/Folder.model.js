import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Folder title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    color: {
      type: String,
      default: "#3b82f6",
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"],
    },
    icon: {
      type: String,
      default: "folder",
      enum: ["folder", "archive", "trash", "star", "work", "personal", "ideas", "projects"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
      index: true,
    },
    path: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      index: true,
    },
    depth: {
      type: Number,
      default: 0,
      min: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    isProtected: {
      type: Boolean,
      default: false,
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

// Indexes
FolderSchema.index({ userId: 1, parentId: 1 });
FolderSchema.index({ userId: 1, path: 1 });
FolderSchema.index({ userId: 1, isArchived: 1 });
FolderSchema.index({ userId: 1, isDefault: 1 });
FolderSchema.index({ userId: 1, title: "text", description: "text" });

// Virtuals
FolderSchema.virtual("noteCount", {
  ref: "Note",
  localField: "_id",
  foreignField: "folderId",
  count: true,
  match: { isTrashed: false }
});

FolderSchema.virtual("subfolders", {
  ref: "Folder",
  localField: "_id",
  foreignField: "parentId",
  match: { isArchived: false }
});

FolderSchema.virtual("notes", {
  ref: "Note",
  localField: "_id",
  foreignField: "folderId",
  match: { isTrashed: false }
});

// Pre-save middleware
FolderSchema.pre("save", async function (next) {
  try {
    // جلوگیری از circular reference
    if (this.parentId && this.parentId.equals(this._id)) {
      throw new Error("Folder cannot be its own parent");
    }

    if (this.isNew || this.isModified("parentId")) {
      if (this.parentId) {
        // چک کردن وجود والد
        const parent = await this.constructor.findById(this.parentId);
        if (!parent) {
          throw new Error("Parent folder not found");
        }
        
        // جلوگیری از nesting بیش از حد
        if (parent.depth >= 4) {
          throw new Error("Maximum folder depth exceeded (max 5 levels)");
        }

        // چک کردن circular reference در مسیر
        const parentPath = parent.path || [];
        if (parentPath.includes(this._id)) {
          throw new Error("Circular reference detected");
        }

        this.path = [...parentPath, parent._id];
        this.depth = parent.depth + 1;
      } else {
        this.path = [];
        this.depth = 0;
      }
    }

    // Auto-set order
    if (this.isNew && (this.order === undefined || this.order === null)) {
      const maxOrder = await this.constructor
        .findOne({ userId: this.userId, parentId: this.parentId })
        .sort({ order: -1 })
        .select("order");
      this.order = maxOrder ? maxOrder.order + 1 : 0;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Static methods
FolderSchema.statics.findByUser = function (userId, options = {}) {
  const query = this.find({ userId });

  if (options.parentId !== undefined) {
    if (options.parentId === null) {
      query.where("parentId").equals(null);
    } else {
      query.where("parentId").equals(options.parentId);
    }
  }

  if (options.isArchived !== undefined) {
    query.where("isArchived").equals(options.isArchived);
  }

  if (options.search) {
    query.where({
      $or: [
        { title: { $regex: options.search, $options: "i" } },
        { description: { $regex: options.search, $options: "i" } },
      ],
    });
  }

  return query.sort({ order: 1, title: 1 });
};

FolderSchema.statics.getTree = async function (userId, parentId = null) {
  const folders = await this.find({ userId, parentId, isArchived: false })
    .sort({ order: 1, title: 1 })
    .lean();

  for (const folder of folders) {
    folder.subfolders = await this.getTree(userId, folder._id);
    folder.noteCount = await mongoose.models.Note.countDocuments({
      folderId: folder._id,
      isTrashed: false,
    });
  }

  return folders;
};

FolderSchema.statics.getPath = async function (folderId) {
  const path = [];
  let current = await this.findById(folderId).select("title color parentId");

  while (current) {
    path.unshift({
      _id: current._id,
      title: current.title,
      color: current.color,
    });
    
    if (current.parentId) {
      current = await this.findById(current.parentId).select("title color parentId");
    } else {
      current = null;
    }
  }

  return path;
};

// Instance methods
FolderSchema.methods.archiveWithChildren = async function () {
  try {
    this.isArchived = true;
    await this.save();

    // Archive all subfolders
    const subfolders = await this.constructor.find({ parentId: this._id });
    for (const subfolder of subfolders) {
      await subfolder.archiveWithChildren();
    }

    // Archive all notes in this folder
    await mongoose.models.Note.updateMany(
      { folderId: this._id },
      { $set: { isArchived: true } }
    );
  } catch (error) {
    console.error("Error archiving folder:", error);
    throw error;
  }
};

FolderSchema.methods.restoreWithChildren = async function () {
  try {
    this.isArchived = false;
    await this.save();

    // Restore all subfolders
    const subfolders = await this.constructor.find({ parentId: this._id, isArchived: true });
    for (const subfolder of subfolders) {
      await subfolder.restoreWithChildren();
    }

    // Restore all notes in this folder
    await mongoose.models.Note.updateMany(
      { folderId: this._id, isArchived: true },
      { $set: { isArchived: false } }
    );
  } catch (error) {
    console.error("Error restoring folder:", error);
    throw error;
  }
};

const Folder = mongoose.models.Folder || mongoose.model("Folder", FolderSchema);
export default Folder;