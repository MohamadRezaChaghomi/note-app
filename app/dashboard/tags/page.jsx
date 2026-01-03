"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Star,
  Trash2,
  Edit,
  RefreshCw,
  X,
  Check,
  Loader2,
  Tag as TagIcon,
  Grid,
  List,
} from "lucide-react";
import { toast } from "sonner";
import "@/styles/tags-page.css";

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedTags, setSelectedTags] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [stats, setStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [sortBy, setSortBy] = useState("name_asc");
  const [pagination, setPagination] = useState(null);

  const [newTag, setNewTag] = useState({
    name: "",
    color: "#3b82f6",
    description: "",
  });

  const loadTags = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        sort: sortBy,
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(`/api/tags?${params}`);
      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.message || "Failed to load tags");
      }

      setTags(data.tags || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Load tags error:", error);
      toast.error(error.message || "Failed to load tags");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, sortBy]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/tags?view=stats");
      const data = await res.json();

      if (data.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Load stats error:", error);
    }
  }, []);

  const refreshAll = useCallback(() => {
    setRefreshing(true);
    loadTags();
    loadStats();
  }, [loadTags, loadStats]);

  useEffect(() => {
    loadTags();
    loadStats();
  }, [loadTags, loadStats]);

  const handleCreateTag = async () => {
    try {
      if (!newTag.name.trim()) {
        toast.error("Tag name is required");
        return;
      }

      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create tag");
      }

      toast.success("Tag created successfully");
      setNewTag({ name: "", color: "#3b82f6", description: "" });
      setShowCreateModal(false);
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to create tag");
    }
  };

  const handleUpdateTag = async (tagId, updates) => {
    try {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update tag");
      }

      toast.success("Tag updated successfully");
      setShowEditModal(false);
      setCurrentTag(null);
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to update tag");
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete tag");
      }

      toast.success("Tag deleted successfully");
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to delete tag");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTags.length === 0) return;
    if (!confirm(`Delete ${selectedTags.length} tag(s)?`)) return;

    try {
      const res = await fetch("/api/tags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulkDelete",
          tagIds: selectedTags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete tags");
      }

      toast.success(data.message || "Tags deleted successfully");
      setSelectedTags([]);
      setBulkMode(false);
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to delete tags");
    }
  };

  const handleToggleFavorite = async (tagId) => {
    try {
      const res = await fetch(`/api/tags/${tagId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleFavorite" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update tag");
      }

      toast.success("Tag updated");
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to update tag");
    }
  };

  const sortOptions = [
    { value: "name_asc", label: "Name A-Z" },
    { value: "name_desc", label: "Name Z-A" },
    { value: "usage_desc", label: "Most Used" },
    { value: "recent", label: "Recently Used" },
    { value: "created_desc", label: "Newest First" },
  ];

  if (loading && !refreshing) {
    return (
      <div className="tags-page">
        <div className="tags-loading-fullscreen">
          <div className="tags-loader-container">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading tags...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tags-page">
      {/* Header */}
      <div className="tags-header">
        <div className="tags-header-content">
          <div className="tags-header-left">
            <div className="tags-page-title">
              <h1>Tags</h1>
              <p className="tags-subtitle">
                {tags.length} tag{tags.length !== 1 ? "s" : ""}
                {stats && ` • ${stats.favorites} favorite`}
              </p>
            </div>
          </div>

          <div className="tags-header-right">
            {/* Refresh Button */}
            <button
              onClick={refreshAll}
              disabled={refreshing}
              className="tags-refresh-btn"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            {/* New Tag Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="new-tag-btn"
            >
              <Plus className="w-5 h-5" />
              New Tag
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="tags-search-container">
          <div className="tags-search-wrapper">
            <Search className="tags-search-icon" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tags-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="tags-clear-search-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="tags-toolbar">
          <div className="tags-toolbar-left">
            {/* View Toggle */}
            <div className="tags-view-toggle">
              <button
                onClick={() => setViewMode("grid")}
                className={`tags-view-btn ${viewMode === "grid" ? "active" : ""}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`tags-view-btn ${viewMode === "list" ? "active" : ""}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="tags-sort-dropdown">
              <Filter className="w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="tags-sort-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="tags-toolbar-right">
            {/* Bulk Select */}
            <button
              onClick={() => {
                setBulkMode(!bulkMode);
                if (bulkMode) setSelectedTags([]);
              }}
              className={`tags-bulk-select-btn ${bulkMode ? "active" : ""}`}
            >
              {bulkMode ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {bulkMode ? "Done" : "Select"}
            </button>

            {/* Bulk Delete */}
            {selectedTags.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="tags-bulk-delete-btn"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedTags.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="tags-display">
        {/* Empty State */}
        {!loading && tags.length === 0 && (
          <div className="tags-empty-state">
            <TagIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No tags yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first tag to organize your notes
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="new-tag-btn"
            >
              <Plus className="w-5 h-5" />
              Create Tag
            </button>
          </div>
        )}

        {/* Select All Bar */}
        {bulkMode && tags.length > 0 && (
          <div className="tags-select-all-bar">
            <label className="tags-select-all-label">
              <input
                type="checkbox"
                checked={selectedTags.length === tags.length}
                onChange={() => {
                  if (selectedTags.length === tags.length) {
                    setSelectedTags([]);
                  } else {
                    setSelectedTags(tags.map((t) => t._id));
                  }
                }}
                className="tags-select-all-checkbox"
              />
              <span>
                {selectedTags.length === tags.length
                  ? "Deselect all"
                  : `Select all ${tags.length} tags`}
              </span>
            </label>
            <div className="tags-selected-count">{selectedTags.length} selected</div>
          </div>
        )}

        {/* Tags Display */}
        {!loading && tags.length > 0 && (
          <div className={`tags-grid-container ${viewMode}-view`}>
            {viewMode === "grid" && (
              <div className="tags-grid">
                {tags.map((tag) => (
                  <div
                    key={tag._id}
                    className={`tag-card ${selectedTags.includes(tag._id) ? "selected" : ""}`}
                  >
                    {bulkMode && (
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag._id)}
                        onChange={(e) => {
                          setSelectedTags((prev) =>
                            prev.includes(tag._id)
                              ? prev.filter((id) => id !== tag._id)
                              : [...prev, tag._id]
                          );
                        }}
                        className="tag-checkbox"
                      />
                    )}

                    <div
                      className="tag-color-indicator"
                      style={{ backgroundColor: tag.color }}
                    />

                    <h3 className="tag-name">{tag.name}</h3>

                    {tag.description && (
                      <p className="tag-description">{tag.description}</p>
                    )}

                    <div className="tag-meta">
                      <span className="tag-usage">
                        {tag.usageCount} use{tag.usageCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="tag-actions">
                      <button
                        onClick={() => handleToggleFavorite(tag._id)}
                        className={`tag-action-btn ${tag.isFavorite ? "active" : ""}`}
                        title={tag.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentTag(tag);
                          setShowEditModal(true);
                        }}
                        className="tag-action-btn"
                        title="Edit tag"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag._id)}
                        className="tag-action-btn danger"
                        title="Delete tag"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="tags-list">
                {tags.map((tag) => (
                  <div
                    key={tag._id}
                    className={`tag-list-item ${selectedTags.includes(tag._id) ? "selected" : ""}`}
                  >
                    {bulkMode && (
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag._id)}
                        onChange={(e) => {
                          setSelectedTags((prev) =>
                            prev.includes(tag._id)
                              ? prev.filter((id) => id !== tag._id)
                              : [...prev, tag._id]
                          );
                        }}
                        className="tag-checkbox"
                      />
                    )}

                    <div
                      className="tag-list-color"
                      style={{ backgroundColor: tag.color }}
                    />

                    <div className="tag-list-info">
                      <h4 className="tag-list-name">{tag.name}</h4>
                      {tag.description && (
                        <p className="tag-list-description">{tag.description}</p>
                      )}
                    </div>

                    <div className="tag-list-meta">
                      <span className="tag-list-usage">
                        {tag.usageCount} use{tag.usageCount !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="tag-list-actions">
                      <button
                        onClick={() => handleToggleFavorite(tag._id)}
                        className={`tag-list-action-btn ${tag.isFavorite ? "active" : ""}`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentTag(tag);
                          setShowEditModal(true);
                        }}
                        className="tag-list-action-btn"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag._id)}
                        className="tag-list-action-btn danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Create New Tag</h2>

            <div className="form-group">
              <label className="form-label">Tag Name</label>
              <input
                type="text"
                value={newTag.name}
                onChange={(e) =>
                  setNewTag({ ...newTag, name: e.target.value })
                }
                placeholder="Enter tag name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={newTag.color}
                  onChange={(e) =>
                    setNewTag({ ...newTag, color: e.target.value })
                  }
                  className="color-input"
                />
                <span className="color-value">{newTag.color}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                value={newTag.description}
                onChange={(e) =>
                  setNewTag({ ...newTag, description: e.target.value })
                }
                placeholder="Enter tag description"
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowCreateModal(false)}
                className="modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTag}
                className="modal-btn primary"
              >
                Create Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && currentTag && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit Tag</h2>

            <div className="form-group">
              <label className="form-label">Tag Name</label>
              <input
                type="text"
                defaultValue={currentTag.name}
                onChange={(e) =>
                  setCurrentTag({ ...currentTag, name: e.target.value })
                }
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                <input
                  type="color"
                  defaultValue={currentTag.color}
                  onChange={(e) =>
                    setCurrentTag({ ...currentTag, color: e.target.value })
                  }
                  className="color-input"
                />
                <span className="color-value">{currentTag.color}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                defaultValue={currentTag.description || ""}
                onChange={(e) =>
                  setCurrentTag({ ...currentTag, description: e.target.value })
                }
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowEditModal(false)}
                className="modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUpdateTag(currentTag._id, {
                    name: currentTag.name,
                    color: currentTag.color,
                    description: currentTag.description,
                  })
                }
                className="modal-btn primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
