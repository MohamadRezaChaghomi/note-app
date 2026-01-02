"use client";

import { 
  Star, Archive, Trash2, Eye, MoreVertical, 
  Clock, Tag, Lock, Link as LinkIcon, Copy,
  Download, Share2, Edit
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import "@/styles/components/notes.css";
export default function NoteCard({ 
  note, 
  selected = false,
  bulkMode = false,
  onSelect,
  onAction,
  onView,
  compact = false
}) {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('fa-IR');
  };

  const handleAction = (action, e) => {
    e?.stopPropagation();
    onAction?.(note._id, action);
    setShowActions(false);
  };

  const handleCopyLink = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/dashboard/notes/${note._id}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
    setShowActions(false);
  };

  if (compact) {
    return (
      <div
        className={`note-card-compact ${selected ? 'selected' : ''}`}
        onClick={() => bulkMode ? onSelect?.(note._id) : onView?.(note)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {bulkMode && (
          <div className="compact-checkbox" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onSelect?.(note._id)}
            />
          </div>
        )}
        
        <div className="compact-content">
          <div className="compact-header">
            <h4 className="compact-title">
              {note.title || "Untitled Note"}
            </h4>
            {note.isLocked && <Lock className="w-3 h-3 text-gray-400" />}
          </div>
          
          <div className="compact-meta">
            <div className="meta-item">
              <Clock className="w-3 h-3" />
              <span>{formatDate(note.updatedAt)}</span>
            </div>
            {note.tags?.length > 0 && (
              <div className="meta-item">
                <Tag className="w-3 h-3" />
                <span>{note.tags.length} tags</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="compact-actions">
          {note.isStarred && (
            <button
              onClick={(e) => handleAction(note.isStarred ? 'unstar' : 'star', e)}
              className="star-btn"
            >
              <Star className="w-3 h-3 fill-current" />
            </button>
          )}
          
          {isHovered && !bulkMode && (
            <button
              onClick={() => onView?.(note)}
              className="view-btn"
            >
              <Eye className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`note-card ${selected ? 'selected' : ''}`}
      onClick={() => bulkMode ? onSelect?.(note._id) : onView?.(note)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
      {bulkMode && (
        <div className="selection-overlay" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect?.(note._id)}
            className="selection-checkbox"
          />
        </div>
      )}

      {/* Card Content */}
      <div className="card-content">
        {/* Header */}
        <div className="card-header">
          <div className="header-left">
            <div className="note-icon">
              {note.isStarred ? (
                <Star className="w-4 h-4 fill-current text-yellow-500" />
              ) : note.isArchived ? (
                <Archive className="w-4 h-4 text-blue-500" />
              ) : (
                <div className="icon-placeholder" />
              )}
            </div>
            
            <div className="note-info">
              <h3 className="note-title">
                {note.title || "Untitled Note"}
              </h3>
              
              <div className="note-meta">
                <div className="meta-item">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(note.updatedAt)}</span>
                </div>
                {note.tags?.length > 0 && (
                  <div className="meta-item">
                    <Tag className="w-3 h-3" />
                    <span>{note.tags.length} tags</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="header-right">
            {note.isLocked && (
              <Lock className="w-4 h-4 text-gray-400" />
            )}
            
            <div className="quick-actions">
              <button
                onClick={(e) => handleAction(note.isStarred ? 'unstar' : 'star', e)}
                className={`action-btn star-btn ${note.isStarred ? 'active' : ''}`}
              >
                <Star className={`w-4 h-4 ${note.isStarred ? 'fill-current' : ''}`} />
              </button>
              
              <div className="more-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="action-btn more-btn"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {showActions && (
                  <div className="actions-dropdown">
                    <div className="dropdown-content">
                      <button
                        onClick={() => {
                          onView?.(note);
                          setShowActions(false);
                        }}
                        className="dropdown-item"
                      >
                        <Eye className="w-4 h-4" />
                        View Note
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView?.(note);
                          setShowActions(false);
                        }}
                        className="dropdown-item"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      
                      <button
                        onClick={handleCopyLink}
                        className="dropdown-item"
                      >
                        <LinkIcon className="w-4 h-4" />
                        Copy Link
                      </button>
                      
                      <button
                        onClick={(e) => handleAction('share', e)}
                        className="dropdown-item"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      
                      <div className="divider" />
                      
                      {!note.isArchived ? (
                        <button
                          onClick={(e) => handleAction('archive', e)}
                          className="dropdown-item"
                        >
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleAction('unarchive', e)}
                          className="dropdown-item"
                        >
                          <Archive className="w-4 h-4" />
                          Unarchive
                        </button>
                      )}
                      
                      {!note.isTrashed ? (
                        <button
                          onClick={(e) => handleAction('trash', e)}
                          className="dropdown-item trash"
                        >
                          <Trash2 className="w-4 h-4" />
                          Move to Trash
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleAction('restore', e)}
                          className="dropdown-item restore"
                        >
                          <Trash2 className="w-4 h-4" />
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Preview */}
        <div className="content-preview">
          {note.content ? (
            <p className="preview-text">
              {note.content.length > 150 
                ? `${note.content.substring(0, 150)}...`
                : note.content
              }
            </p>
          ) : (
            <p className="empty-content">No content yet</p>
          )}
        </div>
        
        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="tags-section">
            <div className="tags-list">
              {note.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="tag-more">
                  +{note.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Status Badges */}
        <div className="status-badges">
          {note.isArchived && (
            <span className="status-badge archived">
              <Archive className="w-3 h-3" />
              Archived
            </span>
          )}
          {note.isTrashed && (
            <span className="status-badge trashed">
              <Trash2 className="w-3 h-3" />
              In Trash
            </span>
          )}
          {note.isLocked && (
            <span className="status-badge locked">
              <Lock className="w-3 h-3" />
              Locked
            </span>
          )}
        </div>
      </div>
      
      {/* Hover Effects */}
      <div className="card-hover-effects" />
    </div>
  );
}