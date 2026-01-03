"use client";

import { useState } from "react";
import { 
  Filter, X, Calendar, Tag, Folder, 
  Star, Archive, Trash2, Clock 
} from "lucide-react";
import "@styles/components/notes/filter-panel.module.css";
export default function FilterPanel({ filters, onFilterChange, onClear }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: 'all',
      folder: null,
      tags: [],
      dateRange: null,
      priority: null
    };
    setLocalFilters(resetFilters);
    onClear();
  };

  const handleStatusChange = (status) => {
    setLocalFilters(prev => ({ ...prev, status }));
  };

  const handleTagChange = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag && !localFilters.tags.includes(tag)) {
        setLocalFilters(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        e.target.value = '';
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setLocalFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const statusOptions = [
    { id: 'all', label: 'All Notes', icon: Filter },
    { id: 'starred', label: 'Starred', icon: Star },
    { id: 'archived', label: 'Archived', icon: Archive },
    { id: 'trashed', label: 'Trashed', icon: Trash2 }
  ];

  const priorityOptions = [
    { id: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'low', label: 'Low', color: 'bg-green-100 text-green-800' }
  ];

  // Mock folders - در واقعیت باید از API بیایند
  const mockFolders = [
    { id: '1', title: 'Personal', count: 12 },
    { id: '2', title: 'Work', count: 8 },
    { id: '3', title: 'Ideas', count: 5 },
    { id: '4', title: 'Archive', count: 3 }
  ];

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>
          <Filter className="w-5 h-5" />
          Filters
        </h3>
        <button onClick={handleReset} className="clear-all-btn">
          Clear All
        </button>
      </div>

      <div className="filter-sections">
        {/* Status Filter */}
        <div className="filter-section">
          <h4>Status</h4>
          <div className="status-options">
            {statusOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleStatusChange(option.id)}
                className={`status-option ${localFilters.status === option.id ? 'active' : ''}`}
              >
                <option.icon className="w-4 h-4" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="filter-section">
          <h4>Priority</h4>
          <div className="priority-options">
            <button
              onClick={() => setLocalFilters(prev => ({ ...prev, priority: null }))}
              className={`priority-option ${!localFilters.priority ? 'active' : ''}`}
            >
              All Priorities
            </button>
            {priorityOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setLocalFilters(prev => ({ ...prev, priority: option.id }))}
                className={`priority-option ${localFilters.priority === option.id ? 'active' : ''} ${option.color}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Folder Filter */}
        <div className="filter-section">
          <h4>
            <Folder className="w-4 h-4" />
            Folder
          </h4>
          <select
            value={localFilters.folder || ''}
            onChange={(e) => setLocalFilters(prev => ({ 
              ...prev, 
              folder: e.target.value || null 
            }))}
            className="folder-select"
          >
            <option value="">All Folders</option>
            {mockFolders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.title} ({folder.count})
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="filter-section">
          <h4>
            <Calendar className="w-4 h-4" />
            Date Range
          </h4>
          <div className="date-inputs">
            <div className="date-input-group">
              <label>From</label>
              <input
                type="date"
                value={localFilters.dateRange?.start || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="date-input"
              />
            </div>
            <div className="date-input-group">
              <label>To</label>
              <input
                type="date"
                value={localFilters.dateRange?.end || ''}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="date-input"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="filter-section">
          <h4>
            <Tag className="w-4 h-4" />
            Tags
          </h4>
          <input
            type="text"
            placeholder="Add tags (press Enter)"
            onKeyDown={handleTagChange}
            className="tag-input"
          />
          {localFilters.tags.length > 0 && (
            <div className="selected-tags">
              {localFilters.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="remove-tag"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="filter-actions">
        <button onClick={handleApply} className="apply-btn">
          Apply Filters
        </button>
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
      </div>
    </div>
  );
}