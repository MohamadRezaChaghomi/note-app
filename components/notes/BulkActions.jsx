"use client";

import { 
  Star, Archive, Trash2, Download, 
  MoreVertical, X, Copy, Pin, Lock 
} from "lucide-react";
import { useState } from "react";
import "@styles/components/notes/bulk-actions.module.css";
export default function BulkActions({ 
  count, 
  onStar, 
  onUnstar, 
  onArchive, 
  onTrash, 
  onDelete,
  onPin,
  onUnpin,
  onDownload,
  onCopy,
  onLock,
  onCancel 
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bulk-actions">
      <div className="bulk-info">
        <span className="count">{count} selected</span>
      </div>
      
      <div className="bulk-buttons">
        <button onClick={onStar} className="bulk-btn" title="Star selected">
          <Star className="w-4 h-4" />
          <span className="btn-text">Star</span>
        </button>
        
        <button onClick={onArchive} className="bulk-btn" title="Archive selected">
          <Archive className="w-4 h-4" />
          <span className="btn-text">Archive</span>
        </button>
        
        <button onClick={onTrash} className="bulk-btn danger" title="Move to trash">
          <Trash2 className="w-4 h-4" />
          <span className="btn-text">Trash</span>
        </button>

        <div className="more-actions">
          <button 
            onClick={() => setShowMore(!showMore)} 
            className="bulk-btn more"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMore && (
            <div className="more-menu">
              <button onClick={onUnstar} className="more-item">
                <Star className="w-4 h-4" />
                Unstar
              </button>
              <button onClick={onPin} className="more-item">
                <Pin className="w-4 h-4" />
                Pin
              </button>
              <button onClick={onUnpin} className="more-item">
                <Pin className="w-4 h-4" />
                Unpin
              </button>
              <button onClick={onLock} className="more-item">
                <Lock className="w-4 h-4" />
                Lock
              </button>
              <button onClick={onCopy} className="more-item">
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button onClick={onDownload} className="more-item">
                <Download className="w-4 h-4" />
                Export
              </button>
              <div className="divider" />
              <button onClick={onDelete} className="more-item delete">
                <Trash2 className="w-4 h-4" />
                Delete Forever
              </button>
            </div>
          )}
        </div>
        
        <button onClick={onCancel} className="bulk-btn cancel" title="Cancel selection">
          <X className="w-4 h-4" />
          <span className="btn-text">Cancel</span>
        </button>
      </div>
    </div>
  );
}