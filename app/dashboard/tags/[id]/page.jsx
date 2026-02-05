"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  FileText,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import "@/styles/tag-detail-page.css";

export default function TagDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = React.use(params)?.id;

  const [tag, setTag] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchTag = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/tags/${id}`);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to load tag");
      }

      setTag(data.tag);
      setIsFavorite(data.tag.isFavorite || false);

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
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleFavorite" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update tag");
      }

      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      toast.error(error.message || "Failed to update tag");
    }
  };

  if (loading) {
    return (
      <div className="tag-loading">
        <Loader2 className="tag-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tag-detail-page">
        <div className="tag-detail-container">
          <button
            onClick={() => router.back()}
            className="back-button"
          >
            <ArrowLeft className="back-icon" />
            Back
          </button>

          <div className="tag-error-container">
            <div className="tag-error">
              <AlertCircle className="tag-error-icon" />
              <div className="tag-error-content">
                <h3 className="tag-error-title">Error Loading Tag</h3>
                <p className="tag-error-message">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="tag-detail-page">
        <div className="tag-detail-container">
          <button
            onClick={() => router.back()}
            className="back-button"
          >
            <ArrowLeft className="back-icon" />
            Back
          </button>

          <div className="tag-not-found">
            <AlertCircle className="tag-not-found-icon" />
            <p className="tag-not-found-text">Tag not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tag-detail-page">
      <div className="tag-detail-container">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="back-button"
        >
          <ArrowLeft className="back-icon" />
          Back
        </button>

        <div className="tag-header">
          <div className="tag-header-content">
            <div className="tag-info">
              <div className="tag-title-container">
                <div
                  className="tag-color-badge"
                  style={{ backgroundColor: tag.color }}
                />
                <h1 className="tag-title">{tag.name}</h1>
              </div>
              {tag.description && (
                <p className="tag-description">{tag.description}</p>
              )}
            </div>

            <div className="tag-actions">
              <button
                onClick={handleToggleFavorite}
                className={`tag-action-btn ${isFavorite ? "tag-action-btn-favorite" : ""}`}
              >
                <Star
                  className="tag-action-icon"
                  fill={isFavorite ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={() => router.push(`/dashboard/tags/${id}/edit`)}
                className="tag-action-btn tag-action-btn-edit"
              >
                <Edit className="tag-action-icon" />
              </button>
              <button
                onClick={handleDelete}
                className="tag-action-btn tag-action-btn-delete"
              >
                <Trash2 className="tag-action-icon" />
              </button>
            </div>
          </div>
        </div>

        {/* Tag Info */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-text">
                <p className="stat-label">Notes with this tag</p>
                <p className="stat-value">{notes.length}</p>
              </div>
              <FileText className="stat-icon stat-icon-notes" />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-text">
                <p className="stat-label">Usage count</p>
                <p className="stat-value">{tag.usageCount || 0}</p>
              </div>
              <FileText className="stat-icon stat-icon-usage" />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-text">
                <p className="stat-label">Created</p>
                <p className="stat-value">
                  {new Date(tag.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Calendar className="stat-icon stat-icon-calendar" />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="notes-section">
          <h2 className="notes-title">Notes with this tag</h2>

          {notes.length === 0 ? (
            <div className="empty-notes">
              <FileText className="empty-notes-icon" />
              <p className="empty-notes-text">No notes have this tag yet</p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => router.push(`/dashboard/notes/${note._id}`)}
                  className="note-card"
                >
                  <h3 className="note-title">
                    {note.title || "Untitled"}
                  </h3>
                  {note.description && (
                    <p className="note-description">{note.description}</p>
                  )}
                  <div className="note-footer">
                    <span className="note-date">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                    {note.isStarred && (
                      <Star className="note-star" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}