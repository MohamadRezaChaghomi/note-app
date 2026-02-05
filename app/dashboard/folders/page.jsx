"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  X,
  Loader2,
  RefreshCw,
  Folder,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import FolderCard from "@/components/folders/FolderCard";
import DeleteModal from "@/components/ui/DeleteModal";
import "@styles/folders-page.css";

export default function FoldersPage() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    folderId: null,
    folderName: "",
    isLoading: false,
  });

  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        limit: "50",
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(`/api/folders?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load folders");
      }

      setFolders(data.folders || []);
      setStats({
        total: data.folders?.length || 0,
      });
    } catch (error) {
      console.error("Load folders error:", error);
      toast.error(error.message || "Failed to load folders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  const refreshAll = useCallback(() => {
    setRefreshing(true);
    loadFolders();
  }, [loadFolders]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const handleDeleteFolder = (folderId) => {
    const folder = folders.find(f => f._id === folderId);
    setDeleteModal({
      isOpen: true,
      folderId,
      folderName: folder?.title || "Untitled",
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`/api/folders/${deleteModal.folderId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete folder");
      }

      toast.success("Folder deleted successfully");
      setDeleteModal({
        isOpen: false,
        folderId: null,
        folderName: "",
        isLoading: false,
      });
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to delete folder");
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      folderId: null,
      folderName: "",
      isLoading: false,
    });
  };

  if (loading && !refreshing) {
    return (
      <div className="folders-page">
        <div className="folders-page-container">
          <div className="folders-loading-fullscreen">
            <div className="folders-loader-container">
              <Loader2 className="folders-loader-spinner animate-spin" />
              <p className="folders-loading-text">Loading folders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="folders-page">
      <div className="folders-page-container">
        {/* Header */}
        <div className="folders-header">
          <div className="folders-header-content">
            <div className="folders-header-left">
              <div className="folders-page-title">
                <h1>Folders</h1>
                <p className="folders-subtitle">
                  {folders.length} folder{folders.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="folders-header-right">
              {/* Refresh Button */}
              <button
                onClick={refreshAll}
                disabled={refreshing}
                className="folders-refresh-btn"
                title="Refresh"
              >
                <RefreshCw className={`folders-refresh-icon ${refreshing ? "animate-spin" : ""}`} />
              </button>

              {/* New Folder Button */}
              <button
                onClick={() => router.push("/dashboard/folders/new")}
                className="new-folder-btn"
              >
                <Plus className="new-folder-icon" />
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
                  <X className="folders-clear-search-icon" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!loading && folders.length === 0 && (
          <div className="folders-empty-state">
            <div className="folders-empty-icon">
              <Folder size={48} />
            </div>
            <h3 className="folders-empty-title">No folders yet</h3>
            <p className="folders-empty-description">
              {searchQuery
                ? "Try a different search term"
                : "Create your first folder to organize your notes"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push("/dashboard/folders/new")}
                className="folders-empty-action-btn"
              >
                <Plus size={18} />
                Create Folder
              </button>
            )}
          </div>
        )}

        {/* Folders Display */}
        {!loading && folders.length > 0 && (
          <div className="folders-display">
            <div className="folders-grid">
              {folders.map((folder) => (
                <FolderCard
                  key={folder._id}
                  folder={folder}
                  onView={() => router.push(`/dashboard/folders/${folder._id}`)}
                  onEdit={() => router.push(`/dashboard/folders/${folder._id}/edit`)}
                  onDelete={() => handleDeleteFolder(folder._id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Folder"
        description="Are you sure you want to delete this folder? This action cannot be undone."
        itemName={deleteModal.folderName}
        isLoading={deleteModal.isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
