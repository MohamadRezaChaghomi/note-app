"use client";

import { useState, useEffect } from "react";
import { 
  Search, Filter, X, Sparkles, 
  Clock, Tag, User, Loader2,
  Star, Archive, Eye, ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import "@/styles/search-page.css";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    sortBy: "relevance",
    timeRange: "all",
    tags: []
  });
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load search history
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setRecentSearches(JSON.parse(savedHistory).slice(0, 5));
    }
  }, []);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        sort: activeFilters.sortBy,
        ...activeFilters
      });
      
      const res = await fetch(`/api/notes?${params}`);
      const data = await res.json();
      
      setNotes(data.notes || []);
      
      // Update search history
      const newHistory = [
        searchQuery,
        ...searchHistory.filter(q => q !== searchQuery)
      ].slice(0, 10);
      
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (value) => {
    setQuery(value);
    
    if (value.trim().length >= 2) {
      // Fetch suggestions
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleQuickSearch = (searchTerm) => {
    setQuery(searchTerm);
    handleSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setQuery("");
    setNotes([]);
    setSuggestions([]);
  };

  const handleNoteClick = (noteId) => {
    router.push(`/dashboard/notes/${noteId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="search-container">
      {/* Hero Section */}
      <div className="search-hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Notes</h1>
          <p className="hero-subtitle">
            Search across all your notes in Persian or English
          </p>
        </div>
        
        {/* Search Box */}
        <div className="search-box">
          <div className="search-input-wrapper">
            <Search className="search-input-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search notes, tags, or content..."
              className="search-input"
              autoFocus
            />
            {query && (
              <button onClick={handleClearSearch} className="clear-search-btn">
                <X className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => handleSearch()} 
              className="search-action-btn"
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(suggestion)}
                  className="suggestion-item"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="quick-filters">
          <div className="filters-header">
            <Filter className="w-4 h-4" />
            <span>Quick Filters</span>
          </div>
          <div className="filter-buttons">
            <button
              onClick={() => handleQuickSearch("starred")}
              className="filter-btn"
            >
              <Star className="w-4 h-4" />
              Starred Notes
            </button>
            <button
              onClick={() => handleQuickSearch("recent")}
              className="filter-btn"
            >
              <Clock className="w-4 h-4" />
              Recent
            </button>
            <button
              onClick={() => handleQuickSearch("archived")}
              className="filter-btn"
            >
              <Archive className="w-4 h-4" />
              Archived
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="search-results">
        {/* Results Header */}
        <div className="results-header">
          <div className="results-stats">
            <h2 className="results-title">
              {notes.length} {notes.length === 1 ? 'Result' : 'Results'}
              {query && ` for "${query}"`}
            </h2>
            {notes.length > 0 && (
              <p className="results-subtitle">
                Sorted by {activeFilters.sortBy}
              </p>
            )}
          </div>
          
          {notes.length > 0 && (
            <div className="results-filters">
              <select
                value={activeFilters.sortBy}
                onChange={(e) => {
                  setActiveFilters(prev => ({ ...prev, sortBy: e.target.value }));
                  handleSearch();
                }}
                className="sort-select"
              >
                <option value="relevance">Relevance</option>
                <option value="updatedAt_desc">Recently Updated</option>
                <option value="createdAt_desc">Newest First</option>
                <option value="title_asc">Title A-Z</option>
              </select>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {notes.length === 0 && query ? (
          <div className="empty-results">
            <div className="empty-icon">
              <Search className="w-12 h-12" />
            </div>
            <h3>No results found</h3>
            <p>Try different keywords or check your spelling</p>
            {recentSearches.length > 0 && (
              <div className="recent-searches">
                <p className="recent-title">Recent searches:</p>
                <div className="recent-tags">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="recent-tag"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div 
                key={note._id} 
                className="search-note-card"
                onClick={() => handleNoteClick(note._id)}
              >
                <div className="note-card-header">
                  <div className="note-card-title">
                    <h3>{note.title || "Untitled Note"}</h3>
                    {note.isStarred && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="note-card-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNoteClick(note._id);
                      }}
                      className="view-note-btn"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="note-card-content">
                  <p className="content-preview">
                    {note.content?.substring(0, 200)}
                    {note.content?.length > 200 && '...'}
                  </p>
                </div>
                
                <div className="note-card-footer">
                  <div className="note-meta">
                    <div className="meta-item">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(note.updatedAt)}</span>
                    </div>
                    {note.tags?.length > 0 && (
                      <div className="meta-item">
                        <Tag className="w-3 h-3" />
                        <span>{note.tags.length} tags</span>
                      </div>
                    )}
                  </div>
                  
                  {note.tags?.length > 0 && (
                    <div className="note-tags">
                      {note.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 2 && (
                        <span className="tag-more">
                          +{note.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Status Badges */}
                <div className="status-badges">
                  {note.isArchived && (
                    <span className="status-badge archived">
                      <Archive className="w-3 h-3" />
                      Archived
                    </span>
                  )}
                  {note.isTrashed && (
                    <span className="status-badge trashed">
                      <X className="w-3 h-3" />
                      Trashed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search History */}
        {recentSearches.length > 0 && notes.length === 0 && !query && (
          <div className="search-history">
            <h3 className="history-title">Recent Searches</h3>
            <div className="history-grid">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(search)}
                  className="history-item"
                >
                  <Clock className="w-4 h-4" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Tips */}
        {notes.length === 0 && (
          <div className="search-tips">
            <h3 className="tips-title">Search Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <Sparkles className="w-6 h-6 text-blue-500" />
                <h4>Use keywords</h4>
                <p>Search for specific words or phrases in your notes</p>
              </div>
              <div className="tip-card">
                <Tag className="w-6 h-6 text-purple-500" />
                <h4>Search by tags</h4>
                <p>Use tag names to find related notes quickly</p>
              </div>
              <div className="tip-card">
                <User className="w-6 h-6 text-green-500" />
                <h4>Full-text search</h4>
                <p>Search works in both Persian and English content</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}