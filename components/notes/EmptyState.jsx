"use client";

import { 
  FileText, Plus, Filter, Search, 
  Folder, Star, Archive 
} from "lucide-react";
import "@styles/components/notes/empty-state.module.css"; 
export default function EmptyState({ filters, onClearFilters, onCreateNote }) {
  const hasFilters = Object.values(filters).some(
    v => v !== null && v !== '' && (!Array.isArray(v) || v.length > 0) && v !== 'all'
  );

  const getEmptyMessage = () => {
    if (filters.status === 'starred') {
      return "You don't have any starred notes yet.";
    }
    if (filters.status === 'archived') {
      return "No archived notes found.";
    }
    if (filters.status === 'trashed') {
      return "Trash is empty.";
    }
    if (hasFilters) {
      return "No notes match your filters.";
    }
    return "You don't have any notes yet.";
  };

  const getSuggestion = () => {
    if (hasFilters) {
      return "Try clearing your filters or creating a new note.";
    }
    return "Create your first note to get started!";
  };

  const getIcon = () => {
    switch (filters.status) {
      case 'starred': return Star;
      case 'archived': return Archive;
      case 'trashed': return Folder;
      default: return FileText;
    }
  };

  const Icon = getIcon();

  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon className="w-16 h-16" />
      </div>
      
      <h3>{getEmptyMessage()}</h3>
      <p className="empty-subtitle">{getSuggestion()}</p>
      
      <div className="empty-actions">
        {hasFilters ? (
          <>
            <button onClick={onClearFilters} className="action-btn secondary">
              <Filter className="w-4 h-4" />
              Clear Filters
            </button>
            <button onClick={onCreateNote} className="action-btn primary">
              <Plus className="w-4 h-4" />
              Create Note
            </button>
          </>
        ) : (
          <button onClick={onCreateNote} className="action-btn primary">
            <Plus className="w-4 h-4" />
            Create Your First Note
          </button>
        )}
      </div>
      
      {!hasFilters && (
        <div className="empty-tips">
          <h4>Quick Tips</h4>
          <ul>
            <li>
              <Search className="w-4 h-4" />
              Use search to find notes quickly
            </li>
            <li>
              <Filter className="w-4 h-4" />
              Filter by status, folder, or tags
            </li>
            <li>
              <Folder className="w-4 h-4" />
              Organize notes into folders
            </li>
            <li>
              <Star className="w-4 h-4" />
              Star important notes for quick access
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}