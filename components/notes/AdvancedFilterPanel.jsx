"use client";

import { useState } from "react";
import { 
  X, Filter, Tag, Calendar, BarChart, Users, 
  Lock, Eye, EyeOff, Clock, Hash, Folder,
  ChevronDown, ChevronUp, Check, Plus, Minus
} from "lucide-react";
import styles from "@styles/components/notes/advanced-filter.module.css";

export default function AdvancedFilterPanel({
  onApplyFilters,
  onClear,
  initialFilters
}) {
  const [filters, setFilters] = useState({
    ...initialFilters,
    wordCount: { min: null, max: null },
    characterCount: { min: null, max: null },
    sharedWith: [],
    lockedOnly: false,
    publicOnly: false,
    hasAttachments: false,
    hasLinks: false,
    hasImages: false
  });

  const [expandedSections, setExpandedSections] = useState({
    metrics: true,
    sharing: true,
    content: true,
    advanced: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleNumericChange = (parentKey, childKey, value) => {
    setFilters(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value ? parseInt(value) : null
      }
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      priority: null,
      tags: [],
      dateRange: null,
      folder: null,
      showArchived: false,
      showTrashed: false,
      wordCount: { min: null, max: null },
      characterCount: { min: null, max: null },
      sharedWith: [],
      lockedOnly: false,
      publicOnly: false,
      hasAttachments: false,
      hasLinks: false,
      hasImages: false
    };
    setFilters(resetFilters);
  };

  const priorityOptions = [
    { id: null, label: 'All Priorities', color: 'gray' },
    { id: 'critical', label: 'Critical', color: 'red' },
    { id: 'high', label: 'High', color: 'orange' },
    { id: 'medium', label: 'Medium', color: 'yellow' },
    { id: 'low', label: 'Low', color: 'green' },
    { id: 'none', label: 'No Priority', color: 'blue' }
  ];

  const contentTypes = [
    { id: 'hasAttachments', label: 'Has Attachments', icon: Paperclip },
    { id: 'hasLinks', label: 'Has Links', icon: Link },
    { id: 'hasImages', label: 'Has Images', icon: Image }
  ];

  return (
    <div className="advanced-filter-panel">
      <div className="panel-header">
        <div className="header-left">
          <Filter size={20} />
          <h3>Advanced Filters</h3>
          <span className="badge">Beta</span>
        </div>
        <div className="header-right">
          <button onClick={handleReset} className="reset-btn">
            Reset All
          </button>
          <button onClick={onClear} className="close-btn">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="panel-content">
        {/* Metrics Section */}
        <div className="filter-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('metrics')}
          >
            <div className="section-title">
              <BarChart size={18} />
              <h4>Content Metrics</h4>
            </div>
            {expandedSections.metrics ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.metrics && (
            <div className="metrics-grid">
              <div className="metric-group">
                <label className="metric-label">
                  <Hash size={14} />
                  Word Count
                </label>
                <div className="range-inputs">
                  <div className="range-input">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.wordCount.min || ''}
                      onChange={(e) => handleNumericChange('wordCount', 'min', e.target.value)}
                      className="range-min"
                    />
                  </div>
                  <span className="range-separator">to</span>
                  <div className="range-input">
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.wordCount.max || ''}
                      onChange={(e) => handleNumericChange('wordCount', 'max', e.target.value)}
                      className="range-max"
                    />
                  </div>
                </div>
              </div>
              
              <div className="metric-group">
                <label className="metric-label">
                  <Hash size={14} />
                  Character Count
                </label>
                <div className="range-inputs">
                  <div className="range-input">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.characterCount.min || ''}
                      onChange={(e) => handleNumericChange('characterCount', 'min', e.target.value)}
                      className="range-min"
                    />
                  </div>
                  <span className="range-separator">to</span>
                  <div className="range-input">
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.characterCount.max || ''}
                      onChange={(e) => handleNumericChange('characterCount', 'max', e.target.value)}
                      className="range-max"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sharing Section */}
        <div className="filter-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('sharing')}
          >
            <div className="section-title">
              <Users size={18} />
              <h4>Sharing & Privacy</h4>
            </div>
            {expandedSections.sharing ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.sharing && (
            <div className="sharing-options">
              <div className="privacy-options">
                <label className="option-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.lockedOnly}
                    onChange={(e) => handleChange('lockedOnly', e.target.checked)}
                  />
                  <Lock size={14} />
                  <span>Only Locked Notes</span>
                </label>
                
                <label className="option-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.publicOnly}
                    onChange={(e) => handleChange('publicOnly', e.target.checked)}
                  />
                  <Eye size={14} />
                  <span>Only Public Notes</span>
                </label>
              </div>
              
              <div className="shared-with">
                <label className="shared-label">Shared With:</label>
                <div className="user-tags">
                  {filters.sharedWith.map((user, index) => (
                    <span key={index} className="user-tag">
                      {user}
                      <button
                        onClick={() => {
                          const newUsers = filters.sharedWith.filter((_, i) => i !== index);
                          handleChange('sharedWith', newUsers);
                        }}
                        className="remove-user"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="add-user">
                  <input
                    type="text"
                    placeholder="Add user by email..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        const newUsers = [...filters.sharedWith, e.target.value.trim()];
                        handleChange('sharedWith', newUsers);
                        e.target.value = '';
                      }
                    }}
                    className="user-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Type Section */}
        <div className="filter-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('content')}
          >
            <div className="section-title">
              <FileText size={18} />
              <h4>Content Types</h4>
            </div>
            {expandedSections.content ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.content && (
            <div className="content-types">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label key={type.id} className="content-type-checkbox">
                    <input
                      type="checkbox"
                      checked={filters[type.id]}
                      onChange={(e) => handleChange(type.id, e.target.checked)}
                    />
                    <Icon size={16} />
                    <span>{type.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Priority Section */}
        <div className="filter-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('advanced')}
          >
            <div className="section-title">
              <BarChart size={18} />
              <h4>Priority Level</h4>
            </div>
            {expandedSections.advanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {expandedSections.advanced && (
            <div className="priority-options">
              {priorityOptions.map((option) => (
                <button
                  key={option.id || 'all'}
                  onClick={() => handleChange('priority', option.id)}
                  className={`priority-option ${filters.priority === option.id ? 'active' : ''} ${option.color}`}
                >
                  {filters.priority === option.id && <Check size={14} />}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Section */}
        <div className="filter-section">
          <div className="section-header">
            <Calendar size={18} />
            <h4>Custom Date Range</h4>
          </div>
          
          <div className="date-range-picker">
            <div className="date-inputs">
              <div className="date-input-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => handleChange('dateRange', { 
                    ...filters.dateRange, 
                    start: e.target.value 
                  })}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => handleChange('dateRange', { 
                    ...filters.dateRange, 
                    end: e.target.value 
                  })}
                  className="date-input"
                />
              </div>
            </div>
            
            <div className="quick-dates">
              <button
                onClick={() => handleChange('dateRange', { start: 'today' })}
                className="quick-date-btn"
              >
                Today
              </button>
              <button
                onClick={() => handleChange('dateRange', { start: 'week' })}
                className="quick-date-btn"
              >
                This Week
              </button>
              <button
                onClick={() => handleChange('dateRange', { start: 'month' })}
                className="quick-date-btn"
              >
                This Month
              </button>
              <button
                onClick={() => handleChange('dateRange', { start: 'year' })}
                className="quick-date-btn"
              >
                This Year
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <button onClick={handleApply} className="apply-filters-btn">
          Apply Advanced Filters
        </button>
      </div>
    </div>
  );
}

// Icons for content types
function Paperclip(props) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>; }
function Link(props) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>; }
function Image(props) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>; }
function FileText(props) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>; }