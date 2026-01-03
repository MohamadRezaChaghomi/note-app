import Tag from '@/models/Tag.model';
import Note from '@/models/Note.model';

export const TagService = {
  // Get all tags for a user
  async getTags(userId, filters = {}) {
    try {
      const query = { userId };
      
      if (filters.search) {
        query.name = { $regex: filters.search, $options: 'i' };
      }
      
      if (filters.favorite) {
        query.isFavorite = true;
      }

      const sortOptions = {
        'name_asc': { name: 1 },
        'name_desc': { name: -1 },
        'usage_desc': { usageCount: -1 },
        'recent': { lastUsed: -1 },
        'created_desc': { createdAt: -1 },
      };

      const sort = sortOptions[filters.sort] || { createdAt: -1 };

      const skip = ((filters.page || 1) - 1) * (filters.limit || 10);

      const tags = await Tag.find(query)
        .sort(sort)
        .skip(skip)
        .limit(filters.limit || 10)
        .lean();

      const total = await Tag.countDocuments(query);

      return {
        tags,
        pagination: {
          total,
          page: filters.page || 1,
          limit: filters.limit || 10,
          pages: Math.ceil(total / (filters.limit || 10)),
        },
      };
    } catch (error) {
      throw new Error(`Failed to get tags: ${error.message}`);
    }
  },

  // Get tag by ID
  async getTagById(tagId, userId) {
    try {
      const tag = await Tag.findOne({ _id: tagId, userId }).lean();
      
      if (!tag) {
        throw new Error('Tag not found');
      }

      // Get note count for this tag
      const noteCount = await Note.countDocuments({
        userId,
        tags: tagId,
      });

      return { ...tag, noteCount };
    } catch (error) {
      throw new Error(`Failed to get tag: ${error.message}`);
    }
  },

  // Create new tag
  async createTag(userId, tagData) {
    try {
      // Check if tag already exists
      const existing = await Tag.findOne({
        userId,
        name: tagData.name.toLowerCase(),
      });

      if (existing) {
        throw new Error('Tag with this name already exists');
      }

      const tag = new Tag({
        userId,
        name: tagData.name.toLowerCase(),
        color: tagData.color || '#3b82f6',
        description: tagData.description || '',
        isFavorite: tagData.isFavorite || false,
      });

      await tag.save();
      return tag;
    } catch (error) {
      throw new Error(`Failed to create tag: ${error.message}`);
    }
  },

  // Update tag
  async updateTag(tagId, userId, updates) {
    try {
      // Check if new name already exists (if name is being updated)
      if (updates.name) {
        const existing = await Tag.findOne({
          userId,
          name: updates.name.toLowerCase(),
          _id: { $ne: tagId },
        });

        if (existing) {
          throw new Error('Tag with this name already exists');
        }

        updates.name = updates.name.toLowerCase();
      }

      const tag = await Tag.findOneAndUpdate(
        { _id: tagId, userId },
        {
          ...updates,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!tag) {
        throw new Error('Tag not found');
      }

      return tag;
    } catch (error) {
      throw new Error(`Failed to update tag: ${error.message}`);
    }
  },

  // Delete tag
  async deleteTag(tagId, userId) {
    try {
      // Remove tag from all notes
      await Note.updateMany(
        { userId, tags: tagId },
        { $pull: { tags: tagId } }
      );

      // Delete the tag
      const result = await Tag.findOneAndDelete({
        _id: tagId,
        userId,
      });

      if (!result) {
        throw new Error('Tag not found');
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to delete tag: ${error.message}`);
    }
  },

  // Bulk delete tags
  async bulkDeleteTags(tagIds, userId) {
    try {
      // Remove tags from all notes
      await Note.updateMany(
        { userId },
        { $pullAll: { tags: tagIds } }
      );

      // Delete the tags
      const result = await Tag.deleteMany({
        _id: { $in: tagIds },
        userId,
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to delete tags: ${error.message}`);
    }
  },

  // Toggle favorite status
  async toggleFavorite(tagId, userId) {
    try {
      const tag = await Tag.findOne({ _id: tagId, userId });

      if (!tag) {
        throw new Error('Tag not found');
      }

      tag.isFavorite = !tag.isFavorite;
      await tag.save();

      return tag;
    } catch (error) {
      throw new Error(`Failed to toggle favorite: ${error.message}`);
    }
  },

  // Update tag usage
  async updateTagUsage(tagId, userId) {
    try {
      const tag = await Tag.findOneAndUpdate(
        { _id: tagId, userId },
        {
          $inc: { usageCount: 1 },
          lastUsed: new Date(),
        },
        { new: true }
      );

      if (!tag) {
        throw new Error('Tag not found');
      }

      return tag;
    } catch (error) {
      throw new Error(`Failed to update tag usage: ${error.message}`);
    }
  },

  // Get tag stats
  async getTagStats(userId) {
    try {
      const tags = await Tag.find({ userId }).lean();
      const total = tags.length;
      const favorites = tags.filter(t => t.isFavorite).length;
      const mostUsed = tags.reduce((max, t) => t.usageCount > max.usageCount ? t : max, tags[0] || {});

      return {
        total,
        favorites,
        mostUsed: mostUsed?._id || null,
      };
    } catch (error) {
      throw new Error(`Failed to get tag stats: ${error.message}`);
    }
  },
};

export default TagService;
