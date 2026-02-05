"use client";

import { useState, useEffect } from "react";
import { 
  X, Filter, Tag, Folder, Calendar, Star, 
  Archive, Trash2, Users, Lock, Unlock,
  Check, ChevronDown, ChevronUp
} from "lucide-react";
import styles from "@styles/components/notes/filter-panel.module.css";

export default function FilterPanel({
  filters,
  onFilterChange,
  onClear,
  onApply
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    tags: true,
    folder: true,
    date: true,
    advanced: false
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onApply) {
      onApply(newFilters);
    } else {
      onFilterChange(newFilters);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const statusOptions = [
    { id: 'all', label: 'All Notes', icon: Filter, color: 'gray' },
    { id: 'starred', label: 'Starred', icon: Star, color: 'yellow' },
    { id: 'archived', label: 'Archived', icon: Archive, color: 'gray' },
    { id: 'trashed', label: 'Trash', icon: Trash2, color: 'red' },
    { id: 'shared', label: 'Shared', icon: Users, color: 'blue' },
    { id: 'locked', label: 'Locked', icon: Lock, color: 'purple' }
  ];

  const priorityOptions = [
    { id: null, label: 'All Priorities', color: 'gray' },
    { id: 'high', label: 'High', color: 'red' },
    { id: 'medium', label: 'Medium', color: 'yellow' },
    { id: 'low', label: 'Low', color: 'green' }
  ];

  const dateOptions = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="filter-panel">
      <div className="panel-header">
        <div className="header-left">
          <Filter size={20} />
          <h3>Filters</h3>
        </div>
        <div className="header-right">
          <button
            onClick={() => {
              const resetFilters = {
                status: 'all',
                folder: null,
                tags: [],
                dateRange: null,
                priority: null,
                showArchived: false,
                showTrashed: false
              };
              setLocalFilters(resetFilters);
              onClear();
            }}
            className="clear-btn"
          >
            Clear All
          </button>
          {onApply && (
            <button
              onClick={() => onApply(localFilters)}
              className="apply-btn"
            >
              Apply
            </button>
          )}
        </div>
      </div>

      <div className="panel-content">
        {/* Status Filter */}
        <div className="filter-section">
          <div className="section-header" onClick={() => toggleSection('status')}>
            <h4>Status</h4>
            {expandedSections.status ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.status && (
            <div className="status-grid">
              {statusOptions.map(option => {
                const Icon = option.icon;
                const isActive = localFilters.status === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleChange('status', option.id)}
                    className={`status-btn ${isActive ? 'active' : ''} ${option.color}`}
                  >
                    <Icon size={16} />
                    <span>{option.label}</span>
                    {isActive && <Check size={14} className="check-icon" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Priority Filter */}
        <div className="filter-section">
          <div className="section-header" onClick={() => toggleSection('advanced')}>
            <h4>Priority</h4>
            {expandedSections.advanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.advanced && (
            <div className="priority-grid">
              {priorityOptions.map(option => (
                <button
                  key={option.id || 'all'}
                  onClick={() => handleChange('priority', option.id)}
                  className={`priority-btn ${localFilters.priority === option.id ? 'active' : ''} ${option.color}`}
                >
                  <span>{option.label}</span>
                  {localFilters.priority === option.id && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="filter-section">
          <div className="section-header" onClick={() => toggleSection('date')}>
            <Calendar size={18} />
            <h4>Date Range</h4>
            {expandedSections.date ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.date && (
            <>
              <div className="date-quick-filters">
                {dateOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (option.id === 'custom') {
                        // Handle custom date range
                      } else {
                        handleChange('dateRange', option.id);
                      }
                    }}
                    className="date-filter-btn"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              <div className="date-custom-range">
                <div className="date-input-group">
                  <label>From</label>
                  <input
                    type="date"
                    value={localFilters.dateRange?.start || ''}
                    onChange={(e) => handleChange('dateRange', { 
                      ...localFilters.dateRange, 
                      start: e.target.value 
                    })}
                    className="date-input"
                  />
                </div>
                <div className="date-input-group">
                  <label>To</label>
                  <input
                    type="date"
                    value={localFilters.dateRange?.end || ''}
                    onChange={(e) => handleChange('dateRange', { 
                      ...localFilters.dateRange, 
                      end: e.target.value 
                    })}
                    className="date-input"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tags */}
        <div className="filter-section">
          <div className="section-header" onClick={() => toggleSection('tags')}>
            <Tag size={18} />
            <h4>Tags</h4>
            {expandedSections.tags ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.tags && (
            <div className="tags-section">
              <div className="selected-tags">
                {localFilters.tags.map((tag, index) => (
                  <span key={index} className="tag-badge">
                    #{tag}
                    <button
                      onClick={() => {
                        const newTags = localFilters.tags.filter((_, i) => i !== index);
                        handleChange('tags', newTags);
                      }}
                      className="remove-tag"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="tags-input">
                <input
                  type="text"
                  placeholder="Add tags..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const newTags = [...localFilters.tags, e.target.value.trim()];
                      handleChange('tags', newTags);
                      e.target.value = '';
                    }
                  }}
                  className="tag-input"
                />
                <button className="add-tag-btn">
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Options */}
        <div className="filter-section">
          <div className="section-header" onClick={() => toggleSection('advanced')}>
            <h4>Advanced Options</h4>
            {expandedSections.advanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.advanced && (
            <div className="advanced-options">
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={localFilters.showArchived}
                  onChange={(e) => handleChange('showArchived', e.target.checked)}
                />
                <span>Include Archived Notes</span>
              </label>
              
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={localFilters.showTrashed}
                  onChange={(e) => handleChange('showTrashed', e.target.checked)}
                />
                <span>Include Trashed Notes</span>
              </label>
              
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={localFilters.showLockedOnly}
                  onChange={(e) => handleChange('showLockedOnly', e.target.checked)}
                />
                <span>Show Only Locked Notes</span>
              </label>
              
              <label className="option-checkbox">
                <input
                  type="checkbox"
                  checked={localFilters.showSharedOnly}
                  onChange={(e) => handleChange('showSharedOnly', e.target.checked)}
                />
                <span>Show Only Shared Notes</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {Object.values(localFilters).some(v => 
        (v !== null && v !== '' && v !== false && v !== 'all') || 
        (Array.isArray(v) && v.length > 0)
      ) && (
        <div className="active-filters">
          <div className="active-filters-header">
            <span>Active Filters:</span>
            <button
              onClick={() => {
                const resetFilters = {
                  status: 'all',
                  folder: null,
                  tags: [],
                  dateRange: null,
                  priority: null,
                  showArchived: false,
                  showTrashed: false
                };
                setLocalFilters(resetFilters);
                onClear();
              }}
              className="clear-all-filters"
            >
              Clear All
            </button>
          </div>
          
          <div className="filter-chips">
            {Object.entries(localFilters).map(([key, value]) => {
              if (!value || value === 'all' || value === false) return null;
              if (Array.isArray(value) && value.length === 0) return null;
              
              let displayValue = value;
              if (Array.isArray(value)) {
                displayValue = value.join(', ');
              } else if (key === 'status') {
                displayValue = statusOptions.find(opt => opt.id === value)?.label || value;
              }
              
              return (
                <span key={key} className="filter-chip">
                  <span className="filter-chip-key">{key}:</span>
                  <span className="filter-chip-value">{displayValue}</span>
                  <button
                    onClick={() => {
                      const resetValue = Array.isArray(value) ? [] : 
                                       key === 'status' ? 'all' : 
                                       key.startsWith('show') ? false : null;
                      handleChange(key, resetValue);
                    }}
                    className="filter-chip-remove"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}