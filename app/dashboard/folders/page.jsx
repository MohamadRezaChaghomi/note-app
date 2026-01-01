"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Folder, FileText, MoreVertical, Trash2, Edit2, Share2 } from "lucide-react";
import "@/styles/folders.css";

export default function FoldersPage() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await fetch("/api/folders");
      if (res.ok) {
        const data = await res.json();
        setFolders(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName })
      });

      if (res.ok) {
        const newFolder = await res.json();
        setFolders([...folders, newFolder.data]);
        setNewFolderName("");
        setShowNewFolderForm(false);
      }
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm("Are you sure? This will not delete the notes inside.")) return;

    try {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setFolders(folders.filter(f => f._id !== folderId));
      }
    } catch (error) {
      console.error("Failed to delete folder:", error);
    }
  };

  return (
    <div className="folders-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Folders</h1>
          <p>Organize your notes by creating folders</p>
        </div>
        <button
          onClick={() => setShowNewFolderForm(!showNewFolderForm)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Folder
        </button>
      </div>

      {/* New Folder Form */}
      {showNewFolderForm && (
        <div className="new-folder-card">
          <form onSubmit={handleCreateFolder}>
            <input
              type="text"
              placeholder="Enter folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              required
            />
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Create</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowNewFolderForm(false);
                  setNewFolderName("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Folders Grid */}
      <div className="folders-grid">
        {loading ? (
          <div className="loading">Loading folders...</div>
        ) : folders.length === 0 ? (
          <div className="empty-state">
            <Folder className="w-12 h-12" />
            <h3>No folders yet</h3>
            <p>Create your first folder to organize your notes</p>
          </div>
        ) : (
          folders.map((folder) => (
            <div key={folder._id} className="folder-card">
              <div className="folder-header">
                <div className="folder-info">
                  <Folder className="w-6 h-6" />
                  <div>
                    <h3>{folder.name}</h3>
                    <p>{folder.notesCount || 0} notes</p>
                  </div>
                </div>
                <div className="folder-actions">
                  <button className="action-btn" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="action-btn" title="Share">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    className="action-btn delete"
                    title="Delete"
                    onClick={() => handleDeleteFolder(folder._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="folder-footer">
                <Link href={`/dashboard/folders/${folder._id}`} className="view-button">
                  View Notes →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
