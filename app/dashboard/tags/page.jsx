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
import DeleteModal from "@/components/ui/DeleteModal";
import "@/styles/tags-page.css";

// Helper function to adjust color brightness
function adjustColorBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

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
  const [sortBy, setSortBy] = useState("name_asc");
  const [pagination, setPagination] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    tagId: null,
    tagName: "",
    isLoading: false,
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

  const handleDeleteTag = (tagId) => {
    const tag = tags.find(t => t._id === tagId);
    setDeleteModal({
      isOpen: true,
      tagId,
      tagName: tag?.name || "Untitled",
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`/api/tags/${deleteModal.tagId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete tag");
      }

      toast.success("Tag deleted successfully");
      setDeleteModal({
        isOpen: false,
        tagId: null,
        tagName: "",
        isLoading: false,
      });
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to delete tag");
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      tagId: null,
      tagName: "",
      isLoading: false,
    });
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
        <div className="tags-page-container">
          <div className="tags-loading-fullscreen">
            <div className="tags-loader-container">
              <Loader2 className="tags-loader-spinner" />
              <p className="tags-loading-text">Loading tags...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tags-page">
      <div className="tags-page-container">
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
                <RefreshCw className={`tags-refresh-icon ${refreshing ? "animate-spin" : ""}`} />
              </button>

              {/* New Tag Button */}
              <button
                onClick={() => router.push("/dashboard/tags/new")}
                className="new-tag-btn"
              >
                <Plus className="new-tag-icon" />
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
                  <X className="tags-clear-search-icon" />
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
                  <Grid className="tags-view-icon" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`tags-view-btn ${viewMode === "list" ? "active" : ""}`}
                  title="List View"
                >
                  <List className="tags-view-icon" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="tags-sort-dropdown">
                <Filter className="tags-sort-icon" />
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
                {bulkMode ? <Check className="tags-bulk-icon" /> : <Edit className="tags-bulk-icon" />}
                {bulkMode ? "Done" : "Select"}
              </button>

              {/* Bulk Delete */}
              {selectedTags.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="tags-bulk-delete-btn"
                >
                  <Trash2 className="tags-bulk-delete-icon" />
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
              <TagIcon className="tags-empty-icon" />
              <h3 className="tags-empty-title">No tags yet</h3>
              <p className="tags-empty-description">
                Create your first tag to organize your notes
              </p>
              <button
                onClick={() => router.push("/dashboard/tags/new")}
                className="new-tag-btn"
              >
                <Plus className="new-tag-icon" />
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
                <span className="tags-select-all-text">
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
                  {tags.map((tag, index) => (
                    <div
                      key={tag._id || `tag-${index}`}
                      className={`tag-card ${selectedTags.includes(tag._id) ? "selected" : ""}`}
                      style={{
                        '--tag-color': tag.color,
                        '--tag-color-start': tag.color,
                        '--tag-color-end': adjustColorBrightness(tag.color, -40),
                      }}
                      onClick={() => !bulkMode && router.push(`/dashboard/tags/${tag._id}`)}
                    >
                      {bulkMode && (
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag._id)}
                          onChange={(e) => {
                            e.stopPropagation();
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
                          {tag.usageCount ?? 0} use{(tag.usageCount ?? 0) !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="tag-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(tag._id);
                          }}
                          className={`tag-action-btn ${tag.isFavorite ? "active" : ""}`}
                          title={tag.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Star className="tag-action-icon" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/tags/${tag._id}/edit`);
                          }}
                          className="tag-action-btn"
                          title="Edit tag"
                        >
                          <Edit className="tag-action-icon" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTag(tag._id);
                          }}
                          className="tag-action-btn danger"
                          title="Delete tag"
                        >
                          <Trash2 className="tag-action-icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="tags-list">
                  {tags.map((tag, index) => (
                    <div
                      key={tag._id || `tag-list-${index}`}
                      className={`tag-list-item ${selectedTags.includes(tag._id) ? "selected" : ""}`}
                      style={{
                        '--tag-color': tag.color,
                        '--tag-color-start': tag.color,
                        '--tag-color-end': adjustColorBrightness(tag.color, -40),
                      }}
                      onClick={() => !bulkMode && router.push(`/dashboard/tags/${tag._id}`)}
                    >
                      {bulkMode && (
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag._id)}
                          onChange={(e) => {
                            e.stopPropagation();
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
                          {tag.usageCount ?? 0} use{(tag.usageCount ?? 0) !== 1 ? "s" : ""}
                        </span>
                      </div>

                      <div className="tag-list-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(tag._id);
                          }}
                          className={`tag-list-action-btn ${tag.isFavorite ? "active" : ""}`}
                        >
                          <Star className="tag-list-action-icon" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/tags/${tag._id}/edit`);
                          }}
                          className="tag-list-action-btn"
                        >
                          <Edit className="tag-list-action-icon" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTag(tag._id);
                          }}
                          className="tag-list-action-btn danger"
                        >
                          <Trash2 className="tag-list-action-icon" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Tag"
        description="Are you sure you want to delete this tag? This action cannot be undone."
        itemName={deleteModal.tagName}
        isLoading={deleteModal.isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}