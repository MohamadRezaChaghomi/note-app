"use client";

import { useState } from "react";
import { 
  Star, Archive, Trash2, MoreVertical, 
  Eye, Edit, Copy, Pin, Lock, Clock, Tag,
  Folder, Calendar, Users
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import "@styles/components/notes/note-card.module.css";
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
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-300';
    }
  };

  return (
    <div 
      className={`note-card ${selected ? 'selected' : ''} ${getPriorityColor()}`}
      onClick={handleCardClick}
      style={{ borderLeftColor: note.color }}
    >
      {/* Header */}
      <div className="card-header">
        <div className="header-left">
          {bulkMode && (
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(note._id);
              }}
              className="note-checkbox"
            />
          )}
          <h3 className="note-title">{note.title || "Untitled Note"}</h3>
        </div>
        <div className="header-right">
          <div className="note-icons">
            {note.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
            {note.isPinned && <Pin className="w-4 h-4 text-blue-500" />}
            {note.isLocked && <Lock className="w-4 h-4 text-gray-500" />}
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="action-button"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showActions && (
              <div className="action-menu">
                <button onClick={(e) => handleAction('star', e)} className="action-item">
                  <Star className="w-4 h-4" />
                  {note.isStarred ? 'Unstar' : 'Star'}
                </button>
                <button onClick={(e) => handleAction('pin', e)} className="action-item">
                  <Pin className="w-4 h-4" />
                  {note.isPinned ? 'Unpin' : 'Pin'}
                </button>
                <button onClick={(e) => handleAction('archive', e)} className="action-item">
                  <Archive className="w-4 h-4" />
                  {note.isArchived ? 'Unarchive' : 'Archive'}
                </button>
                <div className="divider" />
                <button onClick={() => onView(note)} className="action-item">
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button onClick={(e) => handleAction('duplicate', e)} className="action-item">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <div className="divider" />
                <button onClick={(e) => handleAction('trash', e)} className="action-item delete">
                  <Trash2 className="w-4 h-4" />
                  Move to Trash
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Preview */}
      {note.description && (
        <p className="note-preview">
          {note.description.length > 150 
            ? `${note.description.substring(0, 150)}...` 
            : note.description}
        </p>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="tags-container">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="tag">
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="more-tags">+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        <div className="footer-left">
          {note.folder && (
            <span className="folder-badge">
              <Folder className="w-3 h-3" />
              {note.folder.title}
            </span>
          )}
          <span className="date-badge">
            <Clock className="w-3 h-3" />
            {formatDate(note.updatedAt)}
          </span>
        </div>
        <div className="footer-right">
          {note.isArchived && (
            <span className="status-badge archived">
              <Archive className="w-3 h-3" />
            </span>
          )}
          {note.isTrashed && (
            <span className="status-badge trashed">
              <Trash2 className="w-3 h-3" />
            </span>
          )}
          {note.sharedCount > 0 && (
            <span className="shared-badge">
              <Users className="w-3 h-3" />
              {note.sharedCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}