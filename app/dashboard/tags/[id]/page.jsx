"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Star,
  FileText,
  Loader2,
  Tag as TagIcon
} from "lucide-react";
import { toast } from "sonner";
import "@/styles/TagDetailPage.css";

export default function TagDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [tag, setTag] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTag = useCallback(async () => {
    if (!id || id === 'undefined' || typeof id !== 'string') return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/tags/${id}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to load tag");
      }

      setTag(data.tag);

      // Fetch notes with this tag
      const notesRes = await fetch(`/api/notes?tags=${id}`);
      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData.notes || []);
      }
    } catch (err) {
      console.error("Fetch tag error:", err);
      setError(err.message);
      toast.error(err.message || "Failed to load tag");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTag();
    }
  }, [id, fetchTag]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete tag");
      }

      toast.success("Tag deleted successfully");
      router.push("/dashboard/tags");
    } catch (error) {
      toast.error(error.message || "Failed to delete tag");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="tag-detail-page theme-transition">
        <div className="tag-detail-loading">
          <Loader2 className="tag-loading-spinner" />
          <p className="tag-loading-text">Loading tag...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tag-detail-page theme-transition">
        <div className="tag-detail-container tag-not-found">
          <Link href="/dashboard/tags" className="back-to-tags">
            <ArrowLeft className="back-to-tags-icon" />
            Back to Tags
          </Link>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="tag-detail-page theme-transition">
        <div className="tag-detail-container tag-not-found">
          <Link href="/dashboard/tags" className="back-to-tags">
            <ArrowLeft className="back-to-tags-icon" />
            Back to Tags
          </Link>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Tag not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tag-detail-page theme-transition">
      <div className="tag-detail-container">
        <div className="tag-detail-header">
          <Link href="/dashboard/tags" className="back-to-tags">
            <ArrowLeft className="back-to-tags-icon" />
            Back to Tags
          </Link>

          <div className="tag-info-card">
            <div className="tag-info-content">
              <div className="tag-info-main">
                <div
                  className="tag-color-icon"
                  style={{ backgroundColor: tag.color }}
                >
                  <TagIcon className="tag-icon" />
                </div>
                <div className="tag-text-content">
                  <h1 className="tag-title">{tag.name}</h1>
                  {tag.description && (
                    <p className="tag-description">{tag.description}</p>
                  )}
                </div>
              </div>
              
              <div className="tag-actions">
                <Link
                  href={`/dashboard/tags/${id}/edit`}
                  className="edit-tag-btn"
                >
                  <Pencil className="tag-meta-icon" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="delete-tag-btn"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="delete-tag-spinner" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="tag-meta-icon" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="tag-stats-grid">
          <div className="tag-stat-card">
            <p className="tag-stat-label">Total Notes</p>
            <p className="tag-stat-value">{notes.length}</p>
          </div>
          <div className="tag-stat-card">
            <p className="tag-stat-label">Usage Count</p>
            <p className="tag-stat-value">{tag.usageCount || 0}</p>
          </div>
          <div className="tag-stat-card">
            <p className="tag-stat-label">Created Date</p>
            <p className="tag-stat-date">
              {new Date(tag.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="tag-notes-section">
          <h2 className="tag-notes-title">Notes with this tag</h2>
          {notes.length === 0 ? (
            <div className="tag-notes-empty">
              <FileText className="tag-notes-empty-icon" />
              <p className="tag-notes-empty-text">No notes have this tag yet</p>
            </div>
          ) : (
            <div className="tag-notes-list">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="tag-note-item"
                  onClick={() => router.push(`/dashboard/notes/${note._id}`)}
                >
                  <h3 className="tag-note-title">{note.title || "Untitled"}</h3>
                  {note.description && (
                    <p className="tag-note-description">{note.description}</p>
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