"use client";

import { useState } from "react";
import { Search, X, Filter, Sparkles } from "lucide-react";

export default function NotesSearchBar({
  onSearch,
  onClear,
  initialValue = "",
  placeholder = "Search notes...",
  showFilters = false,
  onFilterClick,
  filterActive = false,
  loading = false,
  className = ""
}) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
    }
  };

  const handleClear = () => {
    setSearchValue("");
    if (onClear) {
      onClear();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // If you want real-time search, uncomment below:
    // if (value.trim()) {
    //   onSearch(value.trim());
    // } else {
    //   onClear();
    // }
  };

  return (
    <div className={`notes-search-bar ${className} ${isFocused ? 'focused' : ''}`}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <div className="search-icon-wrapper">
            <Search className="search-icon" size={20} />
          </div>
          
          <input
            type="text"
            value={searchValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="search-input"
            disabled={loading}
            autoComplete="off"
            spellCheck="false"
          />
          
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-btn"
              aria-label="Clear search"
              disabled={loading}
            >
              <X size={16} />
            </button>
          )}
          
          <div className="search-actions">
            {showFilters && (
              <button
                type="button"
                onClick={onFilterClick}
                className={`filter-btn ${filterActive ? 'active' : ''}`}
                aria-label="Open filters"
                disabled={loading}
              >
                <Filter size={18} />
                {filterActive && <span className="filter-indicator" />}
              </button>
            )}
            
            <button
              type="submit"
              className="search-btn"
              disabled={loading || !searchValue.trim()}
              aria-label="Search"
            >
              <Search size={18} />
              <span className="btn-text">Search</span>
            </button>
          </div>
        </div>
        
        {/* Advanced Search Options */}
        <div className="advanced-options">
          <div className="quick-filters">
            <button
              type="button"
              className="quick-filter-btn"
              onClick={() => onSearch("is:starred")}
              disabled={loading}
            >
              <span className="quick-filter-icon">⭐</span>
              Starred
            </button>
            <button
              type="button"
              className="quick-filter-btn"
              onClick={() => onSearch("is:archived")}
              disabled={loading}
            >
              <span className="quick-filter-icon">📁</span>
              Archived
            </button>
            <button
              type="button"
              className="quick-filter-btn"
              onClick={() => onSearch("is:pinned")}
              disabled={loading}
            >
              <span className="quick-filter-icon">📌</span>
              Pinned
            </button>
          </div>
          
          <button
            type="button"
            className="ai-search-btn"
            disabled={loading}
            title="AI-powered search"
          >
            <Sparkles size={16} />
            <span>AI Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}