"use client";

import { 
  Star, Archive, Trash2, MoreVertical, 
  Clock, Tag, Folder, Pin, Lock
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import "@styles/components/notes/note-list.module.css"

export default function NoteList({ 
  notes, 
  selectedNotes, 
  bulkMode, 
  onSelectNote, 
  onNoteAction,
  onViewNote 
}) {
  return (
    <div className="notes-list">
      <div className="list-header">
        <div className="header-cell checkbox-cell">
          {bulkMode && <span className="header-label">Select</span>}
        </div>
        <div className="header-cell title-cell">
          <span className="header-label">Title</span>
        </div>
        <div className="header-cell folder-cell">
          <span className="header-label">Folder</span>
        </div>
        <div className="header-cell tags-cell">
          <span className="header-label">Tags</span>
        </div>
        <div className="header-cell date-cell">
          <span className="header-label">Updated</span>
        </div>
        <div className="header-cell status-cell">
          <span className="header-label">Status</span>
        </div>
        <div className="header-cell actions-cell">
          <span className="header-label">Actions</span>
        </div>
      </div>
      
      <div className="list-body">
        {notes.map((note) => (
          <div 
            key={note._id} 
            className={`list-row ${selectedNotes.includes(note._id) ? 'selected' : ''}`}
            onClick={() => bulkMode ? onSelectNote(note._id) : onViewNote(note)}
          >
            {/* Checkbox */}
            <div className="cell checkbox-cell">
              {bulkMode && (
                <input
                  type="checkbox"
                  checked={selectedNotes.includes(note._id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectNote(note._id);
                  }}
                  className="row-checkbox"
                />
              )}
            </div>

            {/* Title */}
            <div className="cell title-cell">
              <div className="title-content">
                <h4 className="row-title">{note.title || "Untitled"}</h4>
                {note.description && (
                  <p className="row-preview">{note.description}</p>
                )}
              </div>
            </div>

            {/* Folder */}
            <div className="cell folder-cell">
              <span className="folder-badge">
                <Folder className="w-3 h-3" />
                {note.folder?.title || "Uncategorized"}
              </span>
            </div>

            {/* Tags */}
            <div className="cell tags-cell">
              <div className="tags-wrapper">
                {note.tags?.slice(0, 2).map((tag, index) => (
                  <span key={index} className="tag">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
                {note.tags?.length > 2 && (
                  <span className="more-tags">+{note.tags.length - 2}</span>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="cell date-cell">
              <span className="date-badge">
                <Clock className="w-3 h-3" />
                {formatDate(note.updatedAt)}
              </span>
            </div>

            {/* Status */}
            <div className="cell status-cell">
              <div className="status-icons">
                {note.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" title="Starred" />}
                {note.isPinned && <Pin className="w-4 h-4 text-blue-500" title="Pinned" />}
                {note.isArchived && <Archive className="w-4 h-4 text-gray-500" title="Archived" />}
                {note.isLocked && <Lock className="w-4 h-4 text-gray-500" title="Locked" />}
                {note.isTrashed && <Trash2 className="w-4 h-4 text-red-500" title="Trashed" />}
              </div>
            </div>

            {/* Actions */}
            <div className="cell actions-cell">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const dropdown = e.currentTarget.nextElementSibling;
                  dropdown.classList.toggle('show');
                }}
                className="action-button"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              <div className="dropdown-menu">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteAction(note._id, note.isStarred ? 'unstar' : 'star');
                  }}
                  className="dropdown-item"
                >
                  <Star className="w-4 h-4" />
                  {note.isStarred ? 'Unstar' : 'Star'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteAction(note._id, note.isArchived ? 'unarchive' : 'archive');
                  }}
                  className="dropdown-item"
                >
                  <Archive className="w-4 h-4" />
                  {note.isArchived ? 'Unarchive' : 'Archive'}
                </button>
                <div className="divider" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewNote(note);
                  }}
                  className="dropdown-item"
                >
                  View
                </button>
                <div className="divider" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteAction(note._id, 'trash');
                  }}
                  className="dropdown-item delete"
                >
                  <Trash2 className="w-4 h-4" />
                  Move to Trash
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}