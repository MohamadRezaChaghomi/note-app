"use client";

import { FileText, Filter, Plus, Sparkles } from "lucide-react";

export default function EmptyState({ filters, onClearFilters, onCreateNote }) {
  const hasFilters = Object.values(filters).some(v => 
    v !== null && v !== '' && (!Array.isArray(v) || v.length > 0) && v !== 'all'
  );

  if (hasFilters) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Filter className="w-12 h-12" />
        </div>
        <h3>No matching notes found</h3>
        <p>Try adjusting your filters or search terms</p>
        <div className="empty-actions">
          <button
            onClick={onClearFilters}
            className="secondary-btn"
          >
            Clear Filters
          </button>
          <button
            onClick={onCreateNote}
            className="primary-btn"
          >
            <Plus className="w-4 h-4" />
            Create Note
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Sparkles className="w-12 h-12" />
      </div>
      <h3>No notes yet</h3>
      <p>Create your first note to get started</p>
      <div className="empty-actions">
        <button
          onClick={onCreateNote}
          className="primary-btn"
        >
          <Plus className="w-4 h-4" />
          Create Your First Note
        </button>
      </div>
    </div>
  );
}