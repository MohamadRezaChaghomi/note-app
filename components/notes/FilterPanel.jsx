"use client";

import { X, Filter, Calendar, Tag, Folder, Flag } from "lucide-react";
import { useState } from "react";

export default function FilterPanel({ filters, onFilterChange, onClear }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({
      status: 'all',
      folder: null,
      tags: [],
      dateRange: null,
      priority: null
    });
    onClear();
  };

  const tagOptions = ['Work', 'Personal', 'Important', 'Ideas', 'Meeting', 'Project'];
  const folderOptions = ['Work', 'Personal', 'Archive', 'Projects'];
  const priorityOptions = ['High', 'Medium', 'Low'];

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>
          <Filter className="w-4 h-4 inline mr-2" />
          Filters
        </h3>
        <button
          onClick={handleClear}
          className="clear-filters-btn"
        >
          Clear All
        </button>
      </div>

      <div className="filter-grid">
        {/* Tags Filter */}
        <div className="filter-group">
          <label>
            <Tag className="w-4 h-4 inline mr-2" />
            Tags
          </label>
          <div className="tags-selector">
            {tagOptions.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const newTags = localFilters.tags.includes(tag)
                    ? localFilters.tags.filter(t => t !== tag)
                    : [...localFilters.tags, tag];
                  setLocalFilters(prev => ({ ...prev, tags: newTags }));
                }}
                className={`tag-option ${localFilters.tags.includes(tag) ? 'selected' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Folder Filter */}
        <div className="filter-group">
          <label>
            <Folder className="w-4 h-4 inline mr-2" />
            Folder
          </label>
          <select
            value={localFilters.folder || ''}
            onChange={(e) => setLocalFilters(prev => ({ 
              ...prev, 
              folder: e.target.value || null 
            }))}
            className="filter-select"
          >
            <option value="">All Folders</option>
            {folderOptions.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="filter-group">
          <label>
            <Calendar className="w-4 h-4 inline mr-2" />
            Date Range
          </label>
          <div className="date-range-selector">
            <select
              value={localFilters.dateRange || ''}
              onChange={(e) => setLocalFilters(prev => ({ 
                ...prev, 
                dateRange: e.target.value || null 
              }))}
              className="filter-select"
            >
              <option value="">Any Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Priority Filter */}
        <div className="filter-group">
          <label>
            <Flag className="w-4 h-4 inline mr-2" />
            Priority
          </label>
          <select
            value={localFilters.priority || ''}
            onChange={(e) => setLocalFilters(prev => ({ 
              ...prev, 
              priority: e.target.value || null 
            }))}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button
          onClick={handleClear}
          className="secondary-btn"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="primary-btn"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}