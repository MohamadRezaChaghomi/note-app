"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, FolderPlus, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import "@styles/FolderDetailPage.css";

export default function FolderDetailPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [folder, setFolder] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (id) {
      fetchFolder();
      fetchNotes();
    }
  }, [id]);

  const fetchFolder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/folders/${id}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch folder");
      }
      
      const data = await res.json();
      if (data.ok && data.folder) {
        setFolder(data.folder);
      } else {
        throw new Error(data.message || "Folder not found");
      }
    } catch (error) {
      console.error("Error fetching folder:", error);
      toast.error(error.message);
      router.push("/dashboard/folders");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/folders/${id}/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this folder and all its notes?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/folders/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Folder deleted successfully!");
      router.push("/dashboard/folders");
    } catch (error) {
      toast.error(error.message || "Failed to delete folder");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="folder-detail-page theme-transition">
        <div className="folder-detail-loading">
          <Loader2 className="folder-loading-spinner" />
          <p className="folder-loading-text">Loading folder...</p>
        </div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="folder-detail-page theme-transition">
        <div className="folder-detail-container folder-not-found">
          <Link href="/dashboard/folders" className="back-to-folders">
            <ArrowLeft className="back-to-folders-icon" />
            Back to Folders
          </Link>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Folder not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="folder-detail-page theme-transition">
      <div className="folder-detail-container">
        <div className="folder-detail-header">
          <Link href="/dashboard/folders" className="back-to-folders">
            <ArrowLeft className="back-to-folders-icon" />
            Back to Folders
          </Link>

          <div className="folder-info-card">
            <div className="folder-info-content">
              <div className="folder-info-main">
                <div
                  className="folder-color-icon"
                  style={{ backgroundColor: folder.color }}
                >
                  <FolderPlus className="folder-icon" />
                </div>
                <div className="folder-text-content">
                  <h1 className="folder-title">{folder.title}</h1>
                  {folder.description && (
                    <p className="folder-description">{folder.description}</p>
                  )}
                  <div className="folder-meta">
                    <FileText className="folder-meta-icon" />
                    {folder.noteCount || 0} notes
                  </div>
                </div>
              </div>
              
              <div className="folder-actions">
                <Link
                  href={`/dashboard/folders/${id}/edit`}
                  className="edit-folder-btn"
                >
                  <Pencil className="folder-meta-icon" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="delete-folder-btn"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="delete-folder-spinner" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="folder-meta-icon" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="folder-stats-grid">
          <div className="folder-stat-card">
            <p className="folder-stat-label">Total Notes</p>
            <p className="folder-stat-value">{folder.noteCount || 0}</p>
          </div>
          <div className="folder-stat-card">
            <p className="folder-stat-label">Created Date</p>
            <p className="folder-stat-date">
              {new Date(folder.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="folder-stat-card">
            <p className="folder-stat-label">Last Updated</p>
            <p className="folder-stat-date">
              {new Date(folder.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="folder-notes-section">
          <h2 className="folder-notes-title">Notes in this folder</h2>
          {notes.length === 0 ? (
            <div className="folder-notes-empty">
              <FileText className="folder-notes-empty-icon" />
              <p className="folder-notes-empty-text">No notes in this folder yet</p>
            </div>
          ) : (
            <div className="folder-notes-list">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="folder-note-item"
                  onClick={() => router.push(`/notes/${note._id}`)}
                >
                  <h3 className="folder-note-title">{note.title}</h3>
                  {note.description && (
                    <p className="folder-note-description">{note.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}