"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Folder,
  FolderPlus,
  Search,
  Loader2,
  FileText,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import "@styles/FoldersPage.css";

export default function FoldersPage() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/folders?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setFolders(data.folders || []);
    } catch (error) {
      toast.error(error.message || "Failed to load folders");
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFolders();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, loadFolders]);

  const handleDelete = async (folderId) => {
    if (!confirm("Are you sure you want to delete this folder?")) return;

    try {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      toast.success("Folder deleted");
      loadFolders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="folders-page theme-transition">
      <div className="container">
        <div className="folders-header">
          <div className="folders-header-content">
            <div className="folders-title-section">
              <h1>Folders</h1>
              <p>Organize your notes into folders</p>
            </div>
            <Link href="/dashboard/folders/new" className="folders-new-btn">
              <FolderPlus className="folder-card-icon" />
              New Folder
            </Link>
          </div>

          <div className="folders-search-container">
            <div className="folders-search-box">
              <Search className="folders-search-icon" />
              <input
                type="text"
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="folders-search-input"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="folders-loading">
            <Loader2 className="folders-loading-spinner" />
          </div>
        ) : folders.length === 0 ? (
          <div className="folders-empty">
            <Folder className="folders-empty-icon" />
            <h3>No folders yet</h3>
            <p>Create your first folder to organize your notes</p>
            <Link href="/dashboard/folders/new" className="folders-new-btn">
              <FolderPlus className="folder-card-icon" />
              Create Your First Folder
            </Link>
          </div>
        ) : (
          <div className="folders-grid">
            {folders.map((folder) => (
              <div key={folder._id} className="folder-card">
                <div className="folder-card-content">
                  <div className="folder-card-header">
                    <div
                      className="folder-card-icon-container"
                      style={{ backgroundColor: folder.color }}
                    >
                      <Folder className="folder-card-icon" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(folder._id);
                      }}
                      className="folder-card-menu-btn"
                    >
                      <MoreVertical className="folder-card-icon" />
                    </button>
                  </div>
                  <h3 className="folder-card-title">{folder.title}</h3>
                  {folder.description && (
                    <p className="folder-card-description">{folder.description}</p>
                  )}
                  <div className="folder-card-info">
                    <FileText className="folder-card-info-icon" />
                    {folder.noteCount} notes
                  </div>
                </div>
                <div className="folder-card-footer">
                  <button
                    onClick={() => router.push(`/dashboard/folders/${folder._id}`)}
                    className="folder-card-view-btn"
                  >
                    View Folder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}