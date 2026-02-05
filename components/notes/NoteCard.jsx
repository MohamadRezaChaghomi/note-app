"use client";

import { useState } from "react";
import { 
  Star, Trash2, Edit, Lock, Archive, Folder, Calendar
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import styles from "@/styles/components/notes/note-card.module.css";

// Helper function to adjust color brightness
function adjustColorBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

export default function NoteCard({ 
  note, 
  selected = false, 
  bulkMode = false, 
  onSelect, 
  onDelete,
  onEdit,
  onToggleFavorite,
  onView 
}) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.(note._id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit?.(note._id);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite?.(note._id);
  };

  const handleCardClick = () => {
    if (bulkMode) {
      onSelect?.(note._id);
    } else {
      onView?.(note);
    }
  };


  return (
    <div 
      className={`${styles["note-card"]} ${selected ? styles["selected"] : ""} ${note.isArchived ? styles["archived"] : ""}`}
      onClick={handleCardClick}
      style={{
        '--card-color': note.color || "#3b82f6",
        '--card-color-start': note.color || "#3b82f6",
        '--card-color-end': adjustColorBrightness(note.color || "#3b82f6", -40),
      }}
    >
      {bulkMode && (
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect?.(note._id);
          }}
          className={styles["note-checkbox"]}
        />
      )}

      {/* Color Indicator */}
      <div
        className={styles["note-color-indicator"]}
        style={{ backgroundColor: note.color || "#3b82f6" }}
        title={`Note color: ${note.color}`}
      />

      {/* Title */}
      <h3 className={styles["note-title"]}>
        {note.title || "Untitled Note"}
      </h3>

      {/* Description */}
      {note.description && (
        <p className={styles["note-description"]}>
          {note.description.length > 100 
            ? `${note.description.substring(0, 100)}...` 
            : note.description}
        </p>
      )}

      {/* Meta Info */}
      <div className={styles["note-meta"]}>
        {note.folder && (
          <span className={styles["note-folder"]}>
            <Folder size={14} />
            {note.folder.title}
          </span>
        )}
        <span className={styles["note-date"]}>
          <Calendar size={14} />
          {formatDate(note.updatedAt)}
        </span>
      </div>

      {/* Actions */}
      <div className={styles["note-actions"]}>
        <button
          onClick={handleFavoriteClick}
          className={`${styles["note-action-btn"]} ${note.isStarred ? styles["active"] : ""}`}
          title={note.isStarred ? "Remove from favorites" : "Add to favorites"}
        >
          <Star size={16} />
        </button>
        <button
          onClick={handleEditClick}
          className={styles["note-action-btn"]}
          title="Edit note"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={handleDeleteClick}
          className={`${styles["note-action-btn"]} ${styles["danger"]}`}
          title="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}