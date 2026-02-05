"use client";

import { 
  Star, Archive, Trash2, X, Pin, Download, Share2, 
  Copy, Move, Tag, Lock, Unlock, EyeOff, Eye,
  MoreVertical, Check, FileText, Users
} from "lucide-react";
import { useState } from "react";
import styles from "@styles/components/notes/bulk-actions.module.css";

export default function BulkActions({
  count,
  onStar,
  onUnstar,
  onArchive,
  onTrash,
  onDelete,
  onPin,
  onUnpin,
  onCancel,
  onExport,
  onShare,
  onDuplicate,
  onMove,
  onTag,
  onLock,
  onUnlock,
  onHide,
  onUnhide
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bulk-actions">
      <div className="bulk-info">
        <div className="selected-count">
          <Check size={18} />
          <span className="count">{count}</span>
          <span className="label">selected</span>
        </div>
        
        <button
          onClick={onCancel}
          className="cancel-btn"
          title="Cancel selection"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="bulk-buttons">
        {/* Primary Actions */}
        <div className="primary-actions">
          <button
            onClick={onStar}
            className="bulk-btn star"
            title="Star selected notes"
          >
            <Star size={16} />
            <span>Star</span>
          </button>
          
          <button
            onClick={onPin}
            className="bulk-btn pin"
            title="Pin selected notes"
          >
            <Pin size={16} />
            <span>Pin</span>
          </button>
          
          <button
            onClick={onArchive}
            className="bulk-btn archive"
            title="Archive selected notes"
          >
            <Archive size={16} />
            <span>Archive</span>
          </button>
        </div>
        
        {/* Secondary Actions */}
        <div className="secondary-actions">
          <button
            onClick={onShare}
            className="bulk-btn share"
            title="Share selected notes"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
          
          <button
            onClick={onDuplicate}
            className="bulk-btn duplicate"
            title="Duplicate selected notes"
          >
            <Copy size={16} />
            <span>Duplicate</span>
          </button>
          
          <button
            onClick={onMove}
            className="bulk-btn move"
            title="Move selected notes"
          >
            <Move size={16} />
            <span>Move</span>
          </button>
        </div>
        
        {/* More Actions Dropdown */}
        <div className="more-actions">
          <button
            onClick={() => setShowMore(!showMore)}
            className="more-btn"
            title="More actions"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMore && (
            <div className="more-dropdown">
              <div className="dropdown-content">
                <button onClick={onTag} className="dropdown-item">
                  <Tag size={14} />
                  <span>Add Tags</span>
                </button>
                
                <button onClick={onLock} className="dropdown-item">
                  <Lock size={14} />
                  <span>Lock</span>
                </button>
                
                <button onClick={onUnlock} className="dropdown-item">
                  <Unlock size={14} />
                  <span>Unlock</span>
                </button>
                
                <button onClick={onHide} className="dropdown-item">
                  <EyeOff size={14} />
                  <span>Hide</span>
                </button>
                
                <button onClick={onUnhide} className="dropdown-item">
                  <Eye size={14} />
                  <span>Unhide</span>
                </button>
                
                <div className="dropdown-divider" />
                
                <button onClick={onExport} className="dropdown-item">
                  <Download size={14} />
                  <span>Export</span>
                </button>
                
                <div className="dropdown-divider" />
                
                <button onClick={onTrash} className="dropdown-item danger">
                  <Trash2 size={14} />
                  <span>Move to Trash</span>
                </button>
                
                <button onClick={onDelete} className="dropdown-item danger">
                  <Trash2 size={14} />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}