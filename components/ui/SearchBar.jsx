// components/ui/SearchBar.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, X, Filter, SortAsc, 
  Clock, FileText, Folder, Tag,
  ChevronRight, Star, Users,
  History, TrendingUp, MoreVertical,
  Command, ArrowUp, ArrowDown
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchBar({ 
  placeholder = "Search notes, tags, or content...",
  autoFocus = false,
  showFilters = true,
  compact = false
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [recentSearches, setRecentSearches] = useState([
    "meeting notes",
    "shopping list",
    "project ideas",
    "learning log"
  ]);
  const [trendingSearches, setTrendingSearches] = useState([
    { term: "AI research", count: 24 },
    { term: "weekly report", count: 18 },
    { term: "personal goals", count: 15 },
    { term: "team collaboration", count: 12 }
  ]);

  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Handle clicks outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          resultsRef.current && !resultsRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filters = [
    { id: "all", label: "All", icon: FileText },
    { id: "notes", label: "Notes", icon: FileText },
    { id: "folders", label: "Folders", icon: Folder },
    { id: "tags", label: "Tags", icon: Tag },
    { id: "starred", label: "Starred", icon: Star },
    { id: "shared", label: "Shared", icon: Users }
  ];

  const searchResults = [
    {
      id: 1,
      title: "Meeting Notes - Q4 Planning",
      type: "note",
      tags: ["work", "meeting", "planning"],
      content: "Discussed project timeline and deliverables for Q4...",
      date: "Today",
      starred: true,
      matchScore: 95
    },
    {
      id: 2,
      title: "Personal Goals 2024",
      type: "note",
      tags: ["personal", "goals"],
      content: "Annual objectives and personal development plan...",
      date: "Yesterday",
      starred: true,
      matchScore: 87
    },
    {
      id: 3,
      title: "Project Ideas Folder",
      type: "folder",
      count: 8,
      tags: ["projects", "ideas"],
      date: "Last week",
      matchScore: 76
    },
    {
      id: 4,
      title: "work",
      type: "tag",
      count: 12,
      date: "Frequently used",
      matchScore: 65
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Save to history
      const newHistory = [query, ...searchHistory.filter(h => h !== query).slice(0, 4)];
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      
      // Navigate to search results page
      router.push(`/dashboard/search?q=${encodeURIComponent(query)}&filter=${activeFilter}`);
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setShowResults(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowResults(false);
    }
    if (e.key === "Enter" && query.trim()) {
      handleSearch(e);
    }
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (searchRef.current) {
        searchRef.current.focus();
      }
    }
  };

  const selectRecentSearch = (term) => {
    setQuery(term);
    // Optionally trigger search automatically
    // handleSearch({ preventDefault: () => {} });
    setShowResults(true);
  };

  const removeRecentSearch = (term) => {
    const newHistory = searchHistory.filter(h => h !== term);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  return (
    <div className="search-container">
      <style jsx>{`
        .search-container {
          position: relative;
          width: 100%;
          max-width: ${compact ? '400px' : '600px'};
          margin: 0 auto;
        }
        
        .search-form {
          position: relative;
        }
        
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: ${compact ? '0.5rem' : '0.75rem'};
          background: white;
          border: 2px solid #e5e7eb;
          transition: all 0.2s;
          overflow: hidden;
        }
        
        .search-input-wrapper.focused {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .search-input {
          flex: 1;
          padding: ${compact ? '0.5rem 0.75rem' : '0.75rem 1rem'};
          border: none;
          outline: none;
          font-size: ${compact ? '0.875rem' : '1rem'};
          color: #1f2937;
          background: transparent;
          min-width: 0;
        }
        
        .search-input::placeholder {
          color: #9ca3af;
        }
        
        .search-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${compact ? '2.5rem' : '3rem'};
          height: 100%;
          color: #9ca3af;
          flex-shrink: 0;
        }
        
        .search-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding-right: 0.5rem;
          flex-shrink: 0;
        }
        
        .search-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${compact ? '1.75rem' : '2rem'};
          height: ${compact ? '1.75rem' : '2rem'};
          border-radius: 0.375rem;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .search-action-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .clear-btn {
          color: #9ca3af;
        }
        
        .clear-btn:hover {
          color: #dc2626;
        }
        
        .shortcut-hint {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          color: #6b7280;
          background: #f9fafb;
        }
        
        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          margin-top: 0.5rem;
          overflow: hidden;
          transform-origin: top;
          transform: scale(0.95);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
        }
        
        .search-results.visible {
          transform: scale(1);
          opacity: 1;
          visibility: visible;
        }
        
        .results-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .results-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .results-count {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .results-content {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .results-section {
          border-bottom: 1px solid #f3f4f6;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          background: #f9fafb;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
        }
        
        .section-action {
          font-size: 0.75rem;
          color: #3b82f6;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .section-action:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .results-list {
          padding: 0.5rem 0;
        }
        
        .result-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .result-item:hover {
          background: #f9fafb;
        }
        
        .result-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          flex-shrink: 0;
        }
        
        .note-icon {
          background: #dbeafe;
          color: #1d4ed8;
        }
        
        .folder-icon {
          background: #f0f9ff;
          color: #0ea5e9;
        }
        
        .tag-icon {
          background: #f3e8ff;
          color: #7c3aed;
        }
        
        .result-content {
          flex: 1;
          min-width: 0;
        }
        
        .result-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }
        
        .result-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .result-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .result-tag {
          padding: 0.125rem 0.375rem;
          background: #f3f4f6;
          border-radius: 0.25rem;
          font-size: 0.625rem;
          color: #6b7280;
        }
        
        .result-score {
          font-size: 0.75rem;
          font-weight: 600;
          color: #10b981;
        }
        
        .recent-search-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .recent-search-item:hover {
          background: #f9fafb;
        }
        
        .recent-search-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }
        
        .recent-search-term {
          font-size: 0.875rem;
          color: #374151;
        }
        
        .recent-search-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }
        
        .remove-recent-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.375rem;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .remove-recent-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .trending-search-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .trending-search-item:hover {
          background: #f9fafb;
        }
        
        .trending-search-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }
        
        .trending-search-term {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 500;
        }
        
        .trending-search-count {
          font-size: 0.75rem;
          color: #9ca3af;
        }
        
        .search-filters {
          display: flex;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          overflow-x: auto;
        }
        
        .filter-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        
        .filter-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }
        
        .filter-btn:hover:not(.active) {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .empty-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #9ca3af;
          text-align: center;
        }
        
        .empty-results svg {
          margin-bottom: 0.75rem;
        }
        
        .search-suggestions {
          padding: 0.75rem 1.25rem;
          font-size: 0.875rem;
          color: #6b7280;
          border-top: 1px solid #f3f4f6;
        }
        
        .suggestion {
          display: inline-block;
          margin: 0.125rem 0.25rem;
          padding: 0.125rem 0.5rem;
          background: #f3f4f6;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .suggestion:hover {
          background: #e5e7eb;
        }
        
        @media (max-width: 640px) {
          .search-container {
            max-width: 100%;
          }
          
          .search-results {
            position: fixed;
            top: 4rem;
            left: 1rem;
            right: 1rem;
            max-width: 100%;
          }
          
          .search-filters {
            padding: 0.5rem;
          }
          
          .filter-btn {
            padding: 0.25rem 0.5rem;
            font-size: 0.625rem;
          }
        }
      `}</style>

      <form className="search-form" onSubmit={handleSearch}>
        <div 
          className={`search-input-wrapper ${isFocused ? 'focused' : ''} ${compact ? 'compact' : ''}`}
          ref={searchRef}
        >
          <div className="search-icon">
            <Search className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </div>
          
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (query.trim() || searchHistory.length > 0) {
                setShowResults(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input"
            autoFocus={autoFocus}
          />
          
          <div className="search-actions">
            {query && (
              <button
                type="button"
                className="search-action-btn clear-btn"
                onClick={clearSearch}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            {showFilters && (
              <button
                type="button"
                className="search-action-btn"
                onClick={() => setShowResults(!showResults)}
              >
                <Filter className="w-4 h-4" />
              </button>
            )}
            
            {!compact && (
              <div className="shortcut-hint">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Search Results Dropdown */}
      <div 
        className={`search-results ${showResults ? 'visible' : ''}`}
        ref={resultsRef}
      >
        {query ? (
          <>
            <div className="results-header">
              <div className="results-title">
                Search Results
              </div>
              <div className="results-count">
                {searchResults.length} found
              </div>
            </div>
            
            {showFilters && (
              <div className="search-filters">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                      onClick={() => setActiveFilter(filter.id)}
                    >
                      <Icon className="w-3 h-3" />
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            )}
            
            <div className="results-content">
              {searchResults.length > 0 ? (
                <div className="results-list">
                  {searchResults.map((result) => {
                    let Icon;
                    let iconClass = "";
                    
                    switch (result.type) {
                      case "note":
                        Icon = FileText;
                        iconClass = "note-icon";
                        break;
                      case "folder":
                        Icon = Folder;
                        iconClass = "folder-icon";
                        break;
                      case "tag":
                        Icon = Tag;
                        iconClass = "tag-icon";
                        break;
                      default:
                        Icon = FileText;
                    }
                    
                    return (
                      <div
                        key={result.id}
                        className="result-item"
                        onClick={() => router.push(`/dashboard/${result.type}s/${result.id}`)}
                      >
                        <div className={`result-icon ${iconClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="result-content">
                          <div className="result-title">
                            <span>{result.title}</span>
                            {result.starred && <Star className="w-3 h-3 text-yellow-500" />}
                          </div>
                          
                          <div className="result-meta">
                            {result.content && (
                              <span className="result-preview">
                                {result.content.slice(0, 50)}...
                              </span>
                            )}
                            
                            {result.tags && result.tags.length > 0 && (
                              <div className="result-tags">
                                {result.tags.slice(0, 2).map((tag, index) => (
                                  <span key={index} className="result-tag">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <span className="result-date">{result.date}</span>
                          </div>
                        </div>
                        
                        {result.matchScore && (
                          <div className="result-score">
                            {result.matchScore}%
                          </div>
                        )}
                        
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-results">
                  <Search className="w-8 h-8" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-1">Try different keywords</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Recent Searches */}
            {searchHistory.length > 0 && (
              <div className="results-section">
                <div className="section-header">
                  <div className="section-title">
                    <History className="w-4 h-4" />
                    <span>Recent Searches</span>
                  </div>
                  <div 
                    className="section-action"
                    onClick={clearAllHistory}
                  >
                    Clear all
                  </div>
                </div>
                
                <div className="results-list">
                  {searchHistory.map((term, index) => (
                    <div
                      key={index}
                      className="recent-search-item"
                      onClick={() => selectRecentSearch(term)}
                    >
                      <div className="recent-search-content">
                        <History className="w-4 h-4 text-gray-400" />
                        <span className="recent-search-term">{term}</span>
                      </div>
                      
                      <button
                        className="remove-recent-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(term);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Trending Searches */}
            <div className="results-section">
              <div className="section-header">
                <div className="section-title">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending Searches</span>
                </div>
              </div>
              
              <div className="results-list">
                {trendingSearches.map((item, index) => (
                  <div
                    key={index}
                    className="trending-search-item"
                    onClick={() => selectRecentSearch(item.term)}
                  >
                    <div className="trending-search-content">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="trending-search-term">{item.term}</span>
                      <span className="trending-search-count">{item.count} searches</span>
                    </div>
                    
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Search Suggestions */}
            <div className="search-suggestions">
              <p className="text-sm text-gray-500 mb-2">Try searching for:</p>
              <div>
                {["meeting", "personal", "work", "ideas", "todo"].map((term, index) => (
                  <span
                    key={index}
                    className="suggestion"
                    onClick={() => selectRecentSearch(term)}
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}