"use client";

import { Star, Archive, Trash2, X, MoreVertical } from "lucide-react";
import { useState } from "react";
import "@/styles/components/notes.css";
export default function BulkActions({
  count,
  onStar,
  onArchive,
  onTrash,
  onDelete,
  onCancel
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bulk-actions">
      <div className="bulk-header">
        <div className="selected-count">
          {count} selected
        </div>
        <button
          onClick={onCancel}
          className="cancel-btn"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="bulk-buttons">
        <button
          onClick={onStar}
          className="bulk-btn star"
          title="Star selected"
        >
          <Star className="w-4 h-4" />
          Star
        </button>
        
        <button
          onClick={onArchive}
          className="bulk-btn archive"
          title="Archive selected"
        >
          <Archive className="w-4 h-4" />
          Archive
        </button>
        
        <button
          onClick={onTrash}
          className="bulk-btn trash"
          title="Move to trash"
        >
          <Trash2 className="w-4 h-4" />
          Trash
        </button>
        
        <div className="more-actions">
          <button
            onClick={() => setShowMore(!showMore)}
            className="bulk-btn more"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMore && (
            <div className="more-dropdown">
              <button
                onClick={() => {
                  onDelete();
                  setShowMore(false);
                }}
                className="dropdown-item delete"
              >
                <Trash2 className="w-4 h-4" />
                Delete Forever
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}