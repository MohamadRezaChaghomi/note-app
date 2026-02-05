"use client";

import { useState } from "react";
import { 
  Star, Archive, Trash2, MoreVertical, 
  Eye, Edit, Copy, Pin, Lock, Clock, Tag,
  Folder, Calendar, Users, ExternalLink
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import "@/styles/components/notes/note-card.css";

export default function NoteCard({ 
  note, 
  selected = false, 
  bulkMode = false, 
  onSelect, 
  onAction,
  onView 
}) {
  const [showActions, setShowActions] = useState(false);
  
  const handleAction = (action, e) => {
    e.stopPropagation();
    setShowActions(false);
    onAction(note._id, action);
  };

  const handleCardClick = () => {
    if (bulkMode) {
      onSelect(note._id);
    } else {
      onView(note);
    }
  };

  const getPriorityColor = () => {
    switch (note.priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div 
      className={`note-card ${selected ? 'selected' : ''} ${getPriorityColor()} ${note.isArchived ? 'archived' : ''}`}
      onClick={handleCardClick}
      data-priority={note.priority}
    >
      {/* Card Header */}
      <div className="card-header">
        <div className="header-left">
          {bulkMode && (
            <div className="selection-checkbox">
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect(note._id);
                }}
                className="note-checkbox"
              />
            </div>
          )}
          <div className="note-title-section">
            <h3 className="note-title">{note.title || "Untitled Note"}</h3>
            <div className="note-status-icons">
              {note.isStarred && <Star className="icon starred" size={16} />}
              {note.pinned && <Pin className="icon pinned" size={16} />}
              {note.isLocked && <Lock className="icon locked" size={16} />}
              {note.isArchived && <Archive className="icon archived" size={16} />}
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="action-menu-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="action-menu-btn"
            >
              <MoreVertical size={18} />
            </button>
            
            {showActions && (
              <div className="action-menu-dropdown">
                <div className="action-menu-items">
                  <button onClick={() => onView(note)} className="action-menu-item">
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  <button onClick={(e) => handleAction('edit', e)} className="action-menu-item">
                    <Edit size={16} />
                    <span>Edit</span>
                  </button>
                  <button onClick={(e) => handleAction('duplicate', e)} className="action-menu-item">
                    <Copy size={16} />
                    <span>Duplicate</span>
                  </button>
                  
                  <div className="divider" />
                  
                  <button onClick={(e) => handleAction('star', e)} className="action-menu-item">
                    <Star size={16} />
                    <span>{note.isStarred ? 'Unstar' : 'Star'}</span>
                  </button>
                  <button onClick={(e) => handleAction('pin', e)} className="action-menu-item">
                    <Pin size={16} />
                    <span>{note.pinned ? 'Unpin' : 'Pin'}</span>
                  </button>
                  <button onClick={(e) => handleAction('archive', e)} className="action-menu-item">
                    <Archive size={16} />
                    <span>{note.isArchived ? 'Unarchive' : 'Archive'}</span>
                  </button>
                  
                  <div className="divider" />
                  
                  <button onClick={(e) => handleAction('trash', e)} className="action-menu-item delete">
                    <Trash2 size={16} />
                    <span>Move to Trash</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        {note.description && (
          <p className="note-description">
            {note.description.length > 200 
              ? `${note.description.substring(0, 200)}...` 
              : note.description}
          </p>
        )}
        
        {note.tags && note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                <Tag size={12} />
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="tag-more">+{note.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <div className="footer-left">
          {note.folder && (
            <span className="footer-item">
              <Folder size={14} />
              <span>{note.folder.title}</span>
            </span>
          )}
          <span className="footer-item">
            <Clock size={14} />
            <span>{formatDate(note.updatedAt)}</span>
          </span>
        </div>
        <div className="footer-right">
          {note.sharedCount > 0 && (
            <span className="shared-count">
              <Users size={14} />
              <span>{note.sharedCount}</span>
            </span>
          )}
          <button 
            onClick={() => onView(note)} 
            className="view-btn"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Priority Indicator */}
      {note.priority && (
        <div className={`priority-indicator ${note.priority}`} />
      )}
    </div>
  );
}