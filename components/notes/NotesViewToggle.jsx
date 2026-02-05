"use client";

import { Grid, List, Columns } from "lucide-react";

export default function NotesViewToggle({
  viewMode = 'grid',
  onViewChange,
  loading = false,
  className = ""
}) {
  const viewModes = [
    {
      id: 'grid',
      label: 'Grid View',
      icon: Grid,
      description: 'Card layout'
    },
    {
      id: 'list',
      label: 'List View',
      icon: List,
      description: 'Detailed list'
    },
    {
      id: 'compact',
      label: 'Compact View',
      icon: Columns,
      description: 'Minimal view'
    }
  ];

  return (
    <div className={`notes-view-toggle ${className}`}>
      <div className="view-toggle-label">
        View:
      </div>
      <div className="view-toggle-buttons">
        {viewModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = viewMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => !loading && onViewChange(mode.id)}
              className={`view-toggle-btn ${isActive ? 'active' : ''}`}
              disabled={loading}
              aria-label={mode.label}
              title={`${mode.label} - ${mode.description}`}
            >
              <Icon size={18} />
              <span className="btn-label">{mode.label}</span>
              {isActive && <div className="active-indicator" />}
            </button>
          );
        })}
      </div>
      
      {/* View Mode Description */}
      <div className="view-mode-description">
        {viewModes.find(mode => mode.id === viewMode)?.description}
      </div>
    </div>
  );
}