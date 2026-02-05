"use client";

import { FileText, Search, Filter, Plus, Sparkles, Folder, Star } from "lucide-react";
import styles from "@styles/components/notes/empty-state.module.css"; 

export default function EmptyState({
  filters,
  onClearFilters,
  onCreateNote,
  searchQuery
}) {
  const hasActiveFilters = Object.values(filters).some(v => 
    v !== null && v !== '' && (!Array.isArray(v) || v.length > 0) && v !== 'all'
  ) || searchQuery;

  return (
    <div className="empty-state">
      <div className="empty-state-container">
        <div className="empty-state-icon">
          <div className="icon-wrapper">
            {hasActiveFilters ? (
              <Search size={48} />
            ) : (
              <FileText size={48} />
            )}
          </div>
        </div>
        
        <div className="empty-state-content">
          <h3 className="empty-state-title">
            {hasActiveFilters ? 'No matching notes found' : 'No notes yet'}
          </h3>
          <p className="empty-state-description">
            {hasActiveFilters 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Start organizing your thoughts by creating your first note.'
            }
          </p>
          
          <div className="empty-state-actions">
            {hasActiveFilters ? (
              <>
                <button
                  onClick={onClearFilters}
                  className="empty-state-btn primary"
                >
                  <Filter size={16} />
                  Clear Filters
                </button>
                <button
                  onClick={onCreateNote}
                  className="empty-state-btn"
                >
                  <Plus size={16} />
                  Create New Note
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onCreateNote}
                  className="empty-state-btn primary"
                >
                  <Plus size={16} />
                  Create Your First Note
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="empty-state-tips">
          <h4 className="tips-title">Quick Tips</h4>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">
                <Star size={20} />
              </div>
              <h5>Star Important Notes</h5>
              <p>Mark important notes for quick access</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">
                <Folder size={20} />
              </div>
              <h5>Organize with Folders</h5>
              <p>Group related notes together</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">
                <Sparkles size={20} />
              </div>
              <h5>Use Tags</h5>
              <p>Tag notes for better categorization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}