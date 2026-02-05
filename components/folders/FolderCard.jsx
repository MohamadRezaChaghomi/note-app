"use client";

import { 
  Folder, FileText, Trash2, Edit
} from "lucide-react";
import styles from "@/styles/components/folders/folder-card.module.css";

// Helper function to adjust color brightness
function adjustColorBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

export default function FolderCard({ 
  folder,
  selected = false, 
  bulkMode = false, 
  onSelect, 
  onDelete,
  onEdit,
  onView 
}) {
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.(folder._id);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit?.(folder._id);
  };

  const handleCardClick = () => {
    if (bulkMode) {
      onSelect?.(folder._id);
    } else {
      onView?.(folder);
    }
  };

  return (
    <div 
      className={`${styles["folder-card"]} ${selected ? styles["selected"] : ""}`}
      onClick={handleCardClick}
      style={{
        '--card-color': folder.color || "#3b82f6",
        '--card-color-start': folder.color || "#3b82f6",
        '--card-color-end': adjustColorBrightness(folder.color || "#3b82f6", -40),
      }}
    >
      {bulkMode && (
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect?.(folder._id);
          }}
          className={styles["folder-checkbox"]}
        />
      )}

      {/* Color Indicator */}
      <div
        className={styles["folder-color-indicator"]}
        style={{ backgroundColor: folder.color || "#3b82f6" }}
        title={`Folder color: ${folder.color}`}
      />

      {/* Title */}
      <h3 className={styles["folder-title"]}>
        {folder.title || "Untitled Folder"}
      </h3>

      {/* Description */}
      {folder.description && (
        <p className={styles["folder-description"]}>
          {folder.description.length > 80 
            ? `${folder.description.substring(0, 80)}...` 
            : folder.description}
        </p>
      )}

      {/* Meta Info */}
      <div className={styles["folder-meta"]}>
        <span className={styles["folder-usage"]}>
          <FileText size={14} />
          {folder.noteCount ?? 0} note{(folder.noteCount ?? 0) !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Actions */}
      <div className={styles["folder-actions"]}>
        <button
          onClick={handleEditClick}
          className={styles["folder-action-btn"]}
          title="Edit folder"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={handleDeleteClick}
          className={`${styles["folder-action-btn"]} ${styles["danger"]}`}
          title="Delete folder"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
