import { TagService } from '@/services/tag.service';

export async function getTags(req, userId, query) {
  const { search, sort, page, limit, favorite } = query;

  const filters = {
    search: search || '',
    sort: sort || 'name_asc',
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    favorite: favorite === 'true',
  };

  const result = await TagService.getTags(userId, filters);
  
  // Return complete tag objects with all properties
  return {
    tags: result.tags,
    pagination: result.pagination,
  };
}

export async function getTag(req, tagId, userId) {
  const tag = await TagService.getTagById(tagId, userId);
  return tag;
}

export async function createTag(req, userId, body) {
  const { name, color, description, isFavorite } = body;

  if (!name || name.trim().length === 0) {
    throw new Error('Tag name is required');
  }

  if (name.length > 50) {
    throw new Error('Tag name cannot exceed 50 characters');
  }

  const tag = await TagService.createTag(userId, {
    name: name.trim(),
    color: color || '#3b82f6',
    description: description || '',
    isFavorite: isFavorite || false,
  });

  return tag;
}

export async function updateTag(req, tagId, userId, body) {
  const { name, color, description, isFavorite } = body;
  const updates = {};

  if (name !== undefined) {
    if (name.trim().length === 0) {
      throw new Error('Tag name cannot be empty');
    }
    if (name.length > 50) {
      throw new Error('Tag name cannot exceed 50 characters');
    }
    updates.name = name.trim();
  }

  if (color !== undefined) {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      throw new Error('Invalid color format');
    }
    updates.color = color;
  }

  if (description !== undefined) {
    if (description.length > 200) {
      throw new Error('Description cannot exceed 200 characters');
    }
    updates.description = description;
  }

  if (isFavorite !== undefined) {
    updates.isFavorite = isFavorite;
  }

  const tag = await TagService.updateTag(tagId, userId, updates);
  return tag;
}

export async function deleteTag(req, tagId, userId) {
  const tag = await TagService.deleteTag(tagId, userId);
  return tag;
}

export async function bulkDeleteTags(req, userId, body) {
  const { tagIds } = body;

  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    throw new Error('Tag IDs are required');
  }

  const result = await TagService.bulkDeleteTags(tagIds, userId);
  return result;
}

export async function toggleFavorite(req, tagId, userId) {
  const tag = await TagService.toggleFavorite(tagId, userId);
  return tag;
}

export async function getTagStats(req, userId) {
  const stats = await TagService.getTagStats(userId);
  return stats;
}
