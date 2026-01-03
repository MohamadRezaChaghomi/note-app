"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Folder,
  FolderPlus,
  FolderOpen,
  Archive,
  Trash2,
  Edit,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Filter,
  RefreshCw,
  FolderTree,
  BarChart,
  X,
  Check,
  Loader2,
  FolderUp,
  FolderDown,
  Copy,
  Star,
  Lock,
  Unlock,
  Grid,
  List,
  Columns,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import FolderCard from "@/components/folders/FolderCard";
import FolderGrid from "@/components/folders/FolderGrid";
import FolderTreeView from "@/components/folders/FolderTreeView";
import BulkFolderActions from "@/components/folders/BulkFolderActions";
import EmptyFoldersState from "@/components/folders/EmptyFoldersState";
import FolderStats from "@/components/folders/FolderStats";
import CreateFolderModal from "@/components/folders/CreateFolderModal";
import EditFolderModal from "@/components/folders/EditFolderModal";
import DeleteFolderModal from "@/components/folders/DeleteFolderModal";
import "@/styles/folders-page.css";

export default function FoldersPage() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list' | 'tree'
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [stats, setStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [parentFolder, setParentFolder] = useState(null);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [sortBy, setSortBy] = useState("order_asc");

  const loadFolders = useCallback(async (parentId = null) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        parentId: parentId || "",
        withNoteCount: "true",
        sort: sortBy,
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(`/api/folders?${params}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to load folders");
      }

      setFolders(data.folders || []);
      
      // Load breadcrumb if we're in a subfolder
      if (parentId) {
        const breadcrumbRes = await fetch(`/api/folders/${parentId}/path`);
        if (breadcrumbRes.ok) {
          const breadcrumbData = await breadcrumbRes.json();
          setBreadcrumb(breadcrumbData.path || []);
        }
        setParentFolder(parentId);
      } else {
        setBreadcrumb([]);
        setParentFolder(null);
      }
      
    } catch (error) {
      console.error("Load folders error:", error);
      toast.error(error.message || "Failed to load folders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, sortBy]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/folders?view=stats");
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
    loadFolders(parentFolder);
    loadStats();
  }, [loadFolders, loadStats, parentFolder]);

  useEffect(() => {
    loadFolders(parentFolder);
    loadStats();
  }, [loadFolders, loadStats, parentFolder]);

  const handleCreateFolder = async (folderData) => {
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...folderData,
          parentId: parentFolder,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to create folder");
      }

      toast.success("Folder created successfully");
      setShowCreateModal(false);
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to create folder");
      throw error;
    }
  };

  const handleUpdateFolder = async (folderId, updates) => {
    try {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to update folder");
      }

      toast.success("Folder updated successfully");
      setShowEditModal(false);
      setCurrentFolder(null);
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to update folder");
      throw error;
    }
  };

  const handleDeleteFolder = async (folderId, options = {}) => {
    try {
      const params = new URLSearchParams();
      if (options.force) params.append("force", "true");
      if (options.moveNotesTo) params.append("moveNotesTo", options.moveNotesTo);

      const res = await fetch(`/api/folders/${folderId}?${params}`, {
        method: "DELETE",
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete folder");
      }

      toast.success(data.message || "Folder deleted successfully");
      setShowDeleteModal(false);
      setCurrentFolder(null);
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to delete folder");
      throw error;
    }
  };

  const handleBulkAction = async (action, data = {}) => {
    if (selectedFolders.length === 0) return;

    try {
      const res = await fetch("/api/folders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          folderIds: selectedFolders,
          ...data,
        }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || "Bulk action failed");
      }

      toast.success(result.message || "Bulk action completed");
      setSelectedFolders([]);
      setBulkMode(false);
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Bulk action failed");
    }
  };

  const handleFolderClick = (folder) => {
    if (bulkMode) {
      setSelectedFolders(prev =>
        prev.includes(folder._id)
          ? prev.filter(id => id !== folder._id)
          : [...prev, folder._id]
      );
    } else {
      // Navigate into folder
      loadFolders(folder._id);
    }
  };

  const handleBack = () => {
    if (breadcrumb.length > 1) {
      const parent = breadcrumb[breadcrumb.length - 2];
      loadFolders(parent._id);
    } else {
      loadFolders(null);
    }
  };

  const sortOptions = [
    { value: "order_asc", label: "Custom Order", icon: Grid },
    { value: "title_asc", label: "Title A-Z", icon: List },
    { value: "createdAt_desc", label: "Newest First", icon: Plus },
    { value: "updatedAt_desc", label: "Recently Updated", icon: RefreshCw },
  ];

  if (loading && !refreshing) {
    return (
      <div className="folders-page">
        <div className="loading-fullscreen">
          <div className="loader-container">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading folders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="folders-page">
      {/* Header */}
      <div className="folders-header">
        <div className="folders-header-content">
          <div className="folders-header-left">
            <div className="folders-page-title">
              <h1>{parentFolder ? "Subfolders" : "All Folders"}</h1>
              <p className="folders-subtitle">
                {folders.length} folder{folders.length !== 1 ? "s" : ""}
                {parentFolder && " in this folder"}
              </p>
            </div>

            {/* Breadcrumb */}
            {breadcrumb.length > 0 && (
              <div className="folders-breadcrumb">
                <button
                  onClick={() => loadFolders(null)}
                  className="breadcrumb-item"
                >
                  <Folder className="w-4 h-4" />
                  All Folders
                </button>
                {breadcrumb.map((folder) => (
                  <div key={folder._id} className="breadcrumb-separator">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                ))}
                {breadcrumb.map((folder, index) => (
                  <button
                    key={folder._id}
                    onClick={() => loadFolders(folder._id)}
                    className={`breadcrumb-item ${index === breadcrumb.length - 1 ? "active" : ""}`}
                    style={{ color: folder.color }}
                  >
                    {folder.title}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Stats */}
            {stats && <FolderStats stats={stats} />}
          </div>

          <div className="folders-header-right">
            {/* Refresh Button */}
            <button
              onClick={refreshAll}
              disabled={refreshing}
              className="folders-refresh-btn"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>

            {/* New Folder Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="new-folder-btn"
            >
              <FolderPlus className="w-5 h-5" />
              New Folder
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="folders-search-container">
          <div className="folders-search-wrapper">
            <Search className="folders-search-icon" />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="folders-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="folders-clear-search-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="folders-toolbar">
          <div className="folders-toolbar-left">
            {/* View Toggle */}
            <div className="folders-view-toggle">
              <button
                onClick={() => setViewMode("grid")}
                className={`folders-view-btn ${viewMode === "grid" ? "active" : ""}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`folders-view-btn ${viewMode === "list" ? "active" : ""}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("tree")}
                className={`folders-view-btn ${viewMode === "tree" ? "active" : ""}`}
                title="Tree View"
              >
                <FolderTree className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="folders-sort-dropdown">
              <Filter className="w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="folders-sort-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="folders-toolbar-right">
            {/* Bulk Select */}
            <button
              onClick={() => {
                setBulkMode(!bulkMode);
                if (bulkMode) setSelectedFolders([]);
              }}
              className={`folders-bulk-select-btn ${bulkMode ? "active" : ""}`}
            >
              {bulkMode ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {bulkMode ? "Done" : "Select"}
            </button>

            {/* Bulk Actions */}
            {selectedFolders.length > 0 && (
              <BulkFolderActions
                count={selectedFolders.length}
                onArchive={() => handleBulkAction("archive")}
                onUnarchive={() => handleBulkAction("unarchive")}
                onMove={(parentId) => handleBulkAction("move", { parentId })}
                onCancel={() => {
                  setSelectedFolders([]);
                  setBulkMode(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="folders-display">
        {/* Loading State */}
        {loading && !refreshing && (
          <div className="folders-loading-fullscreen">
            <div className="folders-loader-container">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading folders...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && folders.length === 0 && (
          <EmptyFoldersState
            parentFolder={parentFolder}
            onCreateFolder={() => setShowCreateModal(true)}
            onGoBack={handleBack}
          />
        )}

        {/* Folders Display */}
        {!loading && folders.length > 0 && (
          <>
            {/* Select All Bar */}
            {bulkMode && (
              <div className="folders-select-all-bar">
                <label className="folders-select-all-label">
                  <input
                    type="checkbox"
                    checked={selectedFolders.length === folders.length}
                    onChange={() => {
                      if (selectedFolders.length === folders.length) {
                        setSelectedFolders([]);
                      } else {
                        setSelectedFolders(folders.map(f => f._id));
                      }
                    }}
                    className="folders-select-all-checkbox"
                  />
                  <span>
                    {selectedFolders.length === folders.length
                      ? "Deselect all"
                      : `Select all ${folders.length} folders`
                    }
                  </span>
                </label>
                <div className="folders-selected-count">
                  {selectedFolders.length} selected
                </div>
              </div>
            )}

            {/* Folders Grid/List/Tree */}
            <div className={`folders-grid-container ${viewMode}-view`}>
              {viewMode === "grid" && (
                <FolderGrid
                  folders={folders}
                  selectedFolders={selectedFolders}
                  bulkMode={bulkMode}
                  onSelectFolder={setSelectedFolders}
                  onFolderClick={handleFolderClick}
                  onEditFolder={(folder) => {
                    setCurrentFolder(folder);
                    setShowEditModal(true);
                  }}
                  onDeleteFolder={(folder) => {
                    setCurrentFolder(folder);
                    setShowDeleteModal(true);
                  }}
                />
              )}

              {viewMode === "list" && (
                <div className="folders-list">
                  {folders.map((folder) => (
                    <div
                      key={folder._id}
                      className={`folder-list-item ${selectedFolders.includes(folder._id) ? "selected" : ""}`}
                      onClick={() => {
                        if (!bulkMode) {
                          handleFolderClick(folder);
                        }
                      }}
                    >
                      {bulkMode && (
                        <input
                          type="checkbox"
                          checked={selectedFolders.includes(folder._id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            setSelectedFolders(prev =>
                              prev.includes(folder._id)
                                ? prev.filter(id => id !== folder._id)
                                : [...prev, folder._id]
                            );
                          }}
                          className="folder-checkbox"
                        />
                      )}
                      <div className="folder-icon" style={{ backgroundColor: folder.color }}>
                        <Folder className="w-5 h-5 text-white" />
                      </div>
                      <div className="folder-info">
                        <h4 className="folder-title">{folder.title}</h4>
                        {folder.description && (
                          <p className="folder-description">{folder.description}</p>
                        )}
                        <div className="folder-meta">
                          <span className="meta-item">
                            <FileText className="w-3 h-3" />
                            {folder.noteCount} note{folder.noteCount !== 1 ? "s" : ""}
                          </span>
                          {folder.subfolders && folder.subfolders.length > 0 && (
                            <span className="meta-item">
                              <Folder className="w-3 h-3" />
                              {folder.subfolders.length} subfolder{folder.subfolders.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="folder-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentFolder(folder);
                            setShowEditModal(true);
                          }}
                          className="action-btn"
                          title="Edit folder"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentFolder(folder);
                            setShowDeleteModal(true);
                          }}
                          className="action-btn danger"
                          title="Delete folder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === "tree" && (
                <FolderTreeView
                  folders={folders}
                  onFolderClick={handleFolderClick}
                  onEditFolder={(folder) => {
                    setCurrentFolder(folder);
                    setShowEditModal(true);
                  }}
                  onDeleteFolder={(folder) => {
                    setCurrentFolder(folder);
                    setShowDeleteModal(true);
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateFolderModal
          parentFolder={parentFolder}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateFolder}
        />
      )}

      {showEditModal && currentFolder && (
        <EditFolderModal
          folder={currentFolder}
          onClose={() => {
            setShowEditModal(false);
            setCurrentFolder(null);
          }}
          onSubmit={(updates) => handleUpdateFolder(currentFolder._id, updates)}
        />
      )}

      {showDeleteModal && currentFolder && (
        <DeleteFolderModal
          folder={currentFolder}
          onClose={() => {
            setShowDeleteModal(false);
            setCurrentFolder(null);
          }}
          onSubmit={handleDeleteFolder}
          folders={folders}
        />
      )}
    </div>
  );
}