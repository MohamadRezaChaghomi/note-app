"use client";

import { useState, useEffect } from "react";
import { 
  X, Calendar, Tag, Filter, Zap, Folder, 
  Clock, Flag, Eye, EyeOff, Check 
} from "lucide-react";
import "@styles/components/notes/advanced-filter.module.css";
export default function AdvancedFilterPanel({ onApplyFilters, onClear, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    priority: initialFilters.priority || "",
    tags: initialFilters.tags || [],
    dateRange: initialFilters.dateRange || { start: "", end: "" },
    folder: initialFilters.folder || null,
    showArchived: initialFilters.showArchived || false,
    showTrashed: initialFilters.showTrashed || false,
    minViews: initialFilters.minViews || "",
    ...initialFilters
  });

  const priorities = [
    { value: "high", label: "High Priority", color: "var(--color-error-500)", bg: "var(--color-error-50)" },
    { value: "medium", label: "Medium Priority", color: "var(--color-warning-500)", bg: "var(--color-warning-50)" },
    { value: "low", label: "Low Priority", color: "var(--color-success-500)", bg: "var(--color-success-50)" }
  ];

  // Mock folders - در واقعیت باید از API بیایند
  const folders = [
    { id: "1", title: "Personal", color: "#3b82f6" },
    { id: "2", title: "Work", color: "#10b981" },
    { id: "3", title: "Ideas", color: "#8b5cf6" },
    { id: "4", title: "Archive", color: "#6b7280" }
  ];

  const handleApply = () => {
    const cleanedFilters = {
      priority: filters.priority || undefined,
      tags: filters.tags.length > 0 ? filters.tags : undefined,
      dateRange: filters.dateRange.start || filters.dateRange.end ? filters.dateRange : undefined,
      folderId: filters.folder || undefined,
      withTrashed: filters.showTrashed,
      showArchived: filters.showArchived,
      minViews: filters.minViews || undefined
    };
    
    // حذف فیلدهای undefined
    Object.keys(cleanedFilters).forEach(key => 
      cleanedFilters[key] === undefined && delete cleanedFilters[key]
    );
    
    onApplyFilters(cleanedFilters);
  };

  const handleClear = () => {
    setFilters({
      priority: "",
      tags: [],
      dateRange: { start: "", end: "" },
      folder: null,
      showArchived: false,
      showTrashed: false,
      minViews: ""
    });
    onClear();
  };

  const addTag = (tag) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !filters.tags.includes(trimmedTag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="advanced-filter-panel">
      <div className="filter-header">
        <div className="header-content">
          <Filter className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Advanced Filters
          </h3>
        </div>
        <button 
          onClick={handleClear}
          className="close-btn p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Clear all filters"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="filter-sections space-y-6">
        {/* Priority Filter */}
        <div className="filter-section">
          <label className="section-label">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </span>
          </label>
          <div className="priority-options flex flex-wrap gap-2">
            {priorities.map(p => (
              <button
                key={p.value}
                onClick={() => setFilters(prev => ({
                  ...prev,
                  priority: prev.priority === p.value ? "" : p.value
                }))}
                className={`priority-btn inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                  filters.priority === p.value 
                    ? 'border-current font-semibold' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                style={{
                  color: filters.priority === p.value ? p.color : 'var(--text-secondary)',
                  backgroundColor: filters.priority === p.value ? p.bg : 'transparent'
                }}
              >
                {filters.priority === p.value && (
                  <Check className="w-3 h-3" />
                )}
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Folder Filter */}
        <div className="filter-section">
          <label className="section-label">
            <Folder className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Folder
            </span>
          </label>
          <div className="folder-options grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, folder: null }))}
              className={`folder-btn px-3 py-2 rounded-lg border text-sm transition-all ${
                !filters.folder
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              All Folders
            </button>
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  folder: prev.folder === folder.id ? null : folder.id 
                }))}
                className={`folder-btn px-3 py-2 rounded-lg border text-sm transition-all flex items-center gap-2 ${
                  filters.folder === folder.id
                    ? 'border-current font-semibold'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                style={{
                  color: filters.folder === folder.id ? folder.color : 'var(--text-secondary)',
                  borderColor: filters.folder === folder.id ? folder.color : undefined
                }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: folder.color }}
                />
                <span className="truncate">{folder.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="filter-section">
          <label className="section-label">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range
            </span>
          </label>
          <div className="date-inputs grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="date-input-group">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                From
              </label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="date-input-group">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                To
              </label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="filter-section">
          <label className="section-label">
            <Tag className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags
            </span>
          </label>
          <div className="tags-input-wrapper">
            <input
              type="text"
              placeholder="Type a tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {filters.tags.length > 0 && (
              <div className="selected-tags flex flex-wrap gap-2 mt-3">
                {filters.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 rounded-full transition-colors"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Options */}
        <div className="filter-section">
          <label className="section-label mb-3">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Additional Options
            </span>
          </label>
          <div className="additional-options space-y-3">
            <label className="option-checkbox flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showArchived}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  showArchived: e.target.checked 
                }))}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Show Archived Notes
                </span>
              </div>
            </label>
            
            <label className="option-checkbox flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showTrashed}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  showTrashed: e.target.checked 
                }))}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Show Trashed Notes
                </span>
              </div>
            </label>
            
            <div className="views-filter mt-4">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Minimum Views
              </label>
              <input
                type="number"
                min="0"
                value={filters.minViews}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  minViews: e.target.value 
                }))}
                placeholder="e.g., 10"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="filter-actions flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleApply}
          className="apply-btn flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClear}
          className="clear-btn px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-[0.98] transition-all"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}