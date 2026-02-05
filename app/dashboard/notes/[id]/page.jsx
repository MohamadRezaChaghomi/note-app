"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Star,
  FileText,
  Loader2,
  Folder,
  Archive,
  Undo2
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import "@styles/NoteDetailPage.css";

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [folder, setFolder] = useState(null);
  const [tags, setTags] = useState([]);

  const fetchNote = useCallback(async () => {
    if (!id || id === 'undefined' || typeof id !== 'string') return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/notes/${id}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to load note");
      }

      setNote(data.note);

      // Fetch folder info if the note has a folder
      if (data.note.folder) {
        try {
          const folderRes = await fetch(`/api/folders/${data.note.folder}`);
          if (folderRes.ok) {
            const folderData = await folderRes.json();
            if (folderData.ok) {
              setFolder(folderData.folder);
            }
          }
        } catch (err) {
          console.error("Error fetching folder:", err);
        }
      }

      // Fetch tags info if the note has tags
      if (data.note.tags && data.note.tags.length > 0) {
        try {
          const tagsRes = await fetch(`/api/tags?ids=${data.note.tags.join(',')}`);
          if (tagsRes.ok) {
            const tagsData = await tagsRes.json();
            if (tagsData.ok) {
              setTags(tagsData.tags || []);
            }
          }
        } catch (err) {
          console.error("Error fetching tags:", err);
        }
      }
    } catch (err) {
      console.error("Fetch note error:", err);
      setError(err.message);
      toast.error(err.message || "Failed to load note");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id, fetchNote]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      toast.success("Note deleted successfully");
      router.push("/dashboard/notes");
    } catch (error) {
      toast.error(error.message || "Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleArchive = async () => {
    setArchiving(true);
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !note.isArchived }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      setNote({ ...note, isArchived: !note.isArchived });
      toast.success(note.isArchived ? "Note restored" : "Note archived");
    } catch (error) {
      toast.error(error.message || "Failed to update note");
    } finally {
      setArchiving(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !note.isFavorite }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      setNote({ ...note, isFavorite: !note.isFavorite });
      toast.success(note.isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      toast.error(error.message || "Failed to update note");
    }
  };

  if (loading) {
    return (
      <div className="note-detail-page theme-transition">
        <div className="note-detail-loading">
          <Loader2 className="note-loading-spinner" />
          <p className="note-loading-text">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="note-detail-page theme-transition">
        <div className="note-detail-container note-not-found">
          <Link href="/dashboard/notes" className="back-to-notes">
            <ArrowLeft className="back-to-notes-icon" />
            Back to Notes
          </Link>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="note-detail-page theme-transition">
        <div className="note-detail-container note-not-found">
          <Link href="/dashboard/notes" className="back-to-notes">
            <ArrowLeft className="back-to-notes-icon" />
            Back to Notes
          </Link>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Note not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="note-detail-page theme-transition">
      <div className="note-detail-container">
        <div className="note-detail-header">
          <Link href="/dashboard/notes" className="back-to-notes">
            <ArrowLeft className="back-to-notes-icon" />
            Back to Notes
          </Link>

          <div className="note-info-card">
            <div className="note-info-content">
              <div className="note-info-main">
                <div
                  className="note-color-icon"
                  style={{ backgroundColor: note.color }}
                >
                  <FileText className="note-icon" />
                </div>
                <div className="note-text-content">
                  <h1 className="note-title">{note.title}</h1>
                  {note.description && (
                    <p className="note-description">{note.description}</p>
                  )}
                </div>
              </div>
              
              <div className="note-actions">
                <button
                  onClick={handleToggleFavorite}
                  className="favorite-note-btn"
                  title={note.isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star className={`note-meta-icon ${note.isFavorite ? 'filled' : ''}`} />
                  {note.isFavorite ? "Favorited" : "Favorite"}
                </button>
                <Link
                  href={`/dashboard/notes/${id}/edit`}
                  className="edit-note-btn"
                >
                  <Pencil className="note-meta-icon" />
                  Edit
                </Link>
                <button
                  onClick={handleToggleArchive}
                  disabled={archiving}
                  className="archive-note-btn"
                >
                  {archiving ? (
                    <>
                      <Loader2 className="note-meta-icon" />
                      {note.isArchived ? "Restoring..." : "Archiving..."}
                    </>
                  ) : (
                    <>
                      {note.isArchived ? (
                        <>
                          <Undo2 className="note-meta-icon" />
                          Restore
                        </>
                      ) : (
                        <>
                          <Archive className="note-meta-icon" />
                          Archive
                        </>
                      )}
                    </>
                  )}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="delete-note-btn"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="note-meta-icon" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="note-meta-icon" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="note-stats-grid">
          <div className="note-stat-card">
            <p className="note-stat-label">Created</p>
            <p className="note-stat-date">
              {formatDate(note.createdAt)}
            </p>
          </div>
          <div className="note-stat-card">
            <p className="note-stat-label">Last Updated</p>
            <p className="note-stat-date">
              {formatDate(note.updatedAt)}
            </p>
          </div>
          <div className="note-stat-card">
            <p className="note-stat-label">Words</p>
            <p className="note-stat-value">
              {note.content?.split(/\s+/).filter(w => w).length || 0}
            </p>
          </div>
          <div className="note-stat-card">
            <p className="note-stat-label">Characters</p>
            <p className="note-stat-value">
              {note.content?.length || 0}
            </p>
          </div>
        </div>

        {folder && (
          <div className="note-folder-section">
            <h3 className="note-folder-title">Folder</h3>
            <div
              className="note-folder-item"
              onClick={() => router.push(`/dashboard/folders/${folder._id}`)}
              style={{ borderLeftColor: folder.color }}
            >
              <Folder className="note-folder-icon" />
              <div className="note-folder-info">
                <p className="note-folder-name">{folder.title}</p>
                {folder.description && (
                  <p className="note-folder-description">{folder.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="note-tags-section">
            <h3 className="note-tags-title">Tags</h3>
            <div className="note-tags-list">
              {tags.map((tag) => (
                <div
                  key={tag._id}
                  className="note-tag-item"
                  onClick={() => router.push(`/dashboard/tags/${tag._id}`)}
                  style={{ borderColor: tag.color, color: tag.color }}
                >
                  <span className="note-tag-name">{tag.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {note.content && (
          <div className="note-content-section">
            <h3 className="note-content-title">Content</h3>
            <div className="note-content-view">
              {note.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
