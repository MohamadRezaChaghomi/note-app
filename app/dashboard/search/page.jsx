"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Search, Filter, X, Sparkles, 
  Clock, Tag, User, Loader2,
  Star, Archive, Eye, ChevronDown, Folder,
  AlertCircle, Zap, TrendingUp, FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import "@/styles/search-page.css";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchType, setSearchType] = useState("all"); // all, notes, folders, tags
  const [activeFilters, setActiveFilters] = useState({
    sortBy: "relevance",
    timeRange: "all",
    priority: "",
    tags: [],
    status: "all"
  });
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [pageInfo, setPageInfo] = useState({ total: 0, page: 1, totalPages: 1 });

  // Load search history
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setRecentSearches(JSON.parse(savedHistory).slice(0, 5));
    }
  }, []);

  const handleSearch = useCallback(async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        type: searchType,
        limit: 20
      });
      
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      
      if (data.ok) {
        setNotes(data.notes || []);
        setFolders(data.folders || []);
        setTags(data.tags || []);
        setPageInfo({
          total: data.total || 0,
          page: 1,
          totalPages: 1
        });
        
        // Update search history
        const newHistory = [
          searchQuery,
          ...searchHistory.filter(q => q !== searchQuery)
        ].slice(0, 10);
        
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, [query, searchType, searchHistory]);

  const handleInputChange = useCallback(async (value) => {
    setQuery(value);
    
    if (value.trim().length >= 2) {
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
  }, []);

  const handleQuickSearch = useCallback((searchTerm) => {
    setQuery(searchTerm);
    handleSearch(searchTerm);
  }, [handleSearch]);

  const handleClearSearch = useCallback(() => {
    setQuery("");
    setNotes([]);
    setFolders([]);
    setTags([]);
    setSuggestions([]);
  }, []);

  const handleNoteClick = useCallback((noteId) => {
    router.push(`/dashboard/notes/${noteId}`);
  }, [router]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  const quickFilters = useMemo(() => [
    { key: "starred", label: "Starred Notes", icon: Star },
    { key: "recent", label: "Recent", icon: Clock },
    { key: "archived", label: "Archived", icon: Archive }
  ], []);

  const searchTips = useMemo(() => [
    {
      icon: Sparkles,
      title: "Use keywords",
      description: "Search for specific words or phrases in your notes",
      color: "blue"
    },
    {
      icon: Tag,
      title: "Search by tags",
      description: "Use tag names to find related notes quickly",
      color: "purple"
    },
    {
      icon: User,
      title: "Full-text search",
      description: "Search works in both Persian and English content",
      color: "green"
    }
  ], []);

  return (
    <div className="search-container">
      {/* Hero Section */}
      <div className="search-hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Notes</h1>
          <p className="hero-subtitle">
            Professional search with advanced filters and sorting
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
              placeholder="Search by title, content, tags, or keywords..."
              className="search-input"
              autoFocus
            />
            {query && (
              <button onClick={handleClearSearch} className="clear-search-btn" title="Clear search">
                <X className="w-5 h-5" />
              </button>
            )}
            <Button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="search-action-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Search
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              <div className="suggestions-header">
                <Zap className="w-3 h-3" />
                <span>Suggestions</span>
              </div>
              {suggestions.map((suggestion, index) => {
                const icon = suggestion.type === 'note' ? <Tag className="w-4 h-4" /> : 
                            suggestion.type === 'folder' ? <Tag className="w-4 h-4" /> : 
                            <Sparkles className="w-4 h-4" />;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickSearch(suggestion.text || suggestion)}
                    className="suggestion-item"
                    title={suggestion.type || "search"}
                  >
                    {icon}
                    <span>{suggestion.text || suggestion}</span>
                    {suggestion.type && suggestion.type !== 'query' && (
                      <span className="suggestion-type">{suggestion.type}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Filters & Advanced Options */}
        <div className="filters-section">
          <div className="quick-filters">
            <div className="filters-header">
              <Filter className="w-4 h-4" />
              <span>Quick Filters</span>
            </div>
            <div className="filter-buttons">
              {quickFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleQuickSearch(filter.key)}
                  className="filter-btn"
                  title={`Filter by ${filter.label}`}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="advanced-toggle-btn"
            title="Toggle advanced filters"
          >
            <Sparkles className="w-4 h-4" />
            Advanced Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="advanced-filters-panel">
            <div className="filter-group">
              <label>Priority Level</label>
              <div className="filter-options">
                {['', 'low', 'medium', 'high'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, priority }));
                      handleSearch();
                    }}
                    className={`filter-option ${activeFilters.priority === priority ? 'active' : ''}`}
                  >
                    {priority || 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Note Status</label>
              <div className="filter-options">
                {[
                  { value: 'all', label: 'All Notes' },
                  { value: 'starred', label: 'Starred' },
                  { value: 'archived', label: 'Archived' },
                  { value: 'pinned', label: 'Pinned' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setActiveFilters(prev => ({ ...prev, status: option.value }));
                      handleSearch();
                    }}
                    className={`filter-option ${activeFilters.status === option.value ? 'active' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Time Range</label>
              <select
                value={activeFilters.timeRange}
                onChange={(e) => {
                  setActiveFilters(prev => ({ ...prev, timeRange: e.target.value }));
                  handleSearch();
                }}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="search-results">
        {/* Results Header with Stats */}
        <div className="results-header">
          <div className="results-stats">
            <h2 className="results-title">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 inline-block mr-2" />
                  {notes.length} {notes.length === 1 ? 'Result' : 'Results'}
                  {query && ` for "${query}"`}
                </>
              )}
            </h2>
            {notes.length > 0 && (
              <div className="results-info">
                <span className="result-count">Page {pageInfo.page} of {pageInfo.totalPages}</span>
                <span className="result-separator">•</span>
                <span className="sort-info">Sorted by <strong>{activeFilters.sortBy === 'relevance' ? 'Relevance' : activeFilters.sortBy}</strong></span>
              </div>
            )}
          </div>
          
          {/* Advanced Sorting Options */}
          {notes.length > 0 && (
            <div className="results-controls">
              <div className="sort-controls">
                <label>Sort by:</label>
                <select
                  value={activeFilters.sortBy}
                  onChange={(e) => {
                    setActiveFilters(prev => ({ ...prev, sortBy: e.target.value }));
                    handleSearch();
                  }}
                  className="sort-select professional"
                >
                  <optgroup label="Relevance">
                    <option value="relevance">Best Match</option>
                  </optgroup>
                  <optgroup label="Date">
                    <option value="updatedAt_desc">Recently Updated</option>
                    <option value="createdAt_desc">Newest First</option>
                    <option value="createdAt_asc">Oldest First</option>
                  </optgroup>
                  <optgroup label="Alphabetical">
                    <option value="title_asc">Title A-Z</option>
                    <option value="title_desc">Title Z-A</option>
                  </optgroup>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {(notes.length === 0 && folders.length === 0 && tags.length === 0) && query ? (
          <Card className="empty-results">
            <div className="empty-icon">
              <AlertCircle className="w-12 h-12" />
            </div>
            <h3>No results found</h3>
            <p>Try different keywords, adjust filters, or check your spelling</p>
            {recentSearches.length > 0 && (
              <div className="recent-searches">
                <p className="recent-title">Recent searches:</p>
                <div className="recent-tags">
                  {recentSearches.map((search, index) => (
                    <button
                      key={`recent-${index}`}
                      onClick={() => handleQuickSearch(search)}
                      className="recent-tag"
                      title={`Search for "${search}"`}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ) : (notes.length > 0 || folders.length > 0 || tags.length > 0) ? (
          <>
            {/* Notes Results */}
            {notes.length > 0 && (
              <>
                <h3 className="results-category-title">
                  <FileText className="w-5 h-5" /> Notes ({notes.length})
                </h3>
                <div className="notes-grid">
                  {notes.map((note) => (
                    <Card
                      key={note._id}
                      className="search-note-card"
                      onClick={() => handleNoteClick(note._id)}
                    >
                      {/* Card Header with Title and Actions */}
                      <div className="note-card-header">
                        <div className="note-card-title-section">
                          <h3 className="note-card-title">{note.title || "Untitled Note"}</h3>
                          {note.isStarred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" title="Starred" />
                          )}
                          {note.isPinned && (
                            <div className="pinned-badge" title="Pinned">📌</div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNoteClick(note._id);
                          }}
                          className="view-note-btn"
                          title="View note details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Content Preview */}
                      <div className="note-card-content">
                        <p className="content-preview">
                          {note.content?.substring(0, 200) || "No content"}
                        </p>
                      </div>
                      
                      {/* Metadata */}
                      <div className="note-card-footer">
                        <span className="note-date">{formatDate(note.createdAt)}</span>
                        {note.priority && (
                          <span className={`priority-badge priority-${note.priority}`}>
                            {note.priority}
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Folders Results */}
            {folders.length > 0 && (
              <>
                <h3 className="results-category-title">
                  <Folder className="w-5 h-5" /> Folders ({folders.length})
                </h3>
                <div className="results-list">
                  {folders.map((folder) => (
                    <Card
                      key={folder._id}
                      className="search-result-item"
                      onClick={() => router.push(`/dashboard/folders/${folder._id}`)}
                    >
                      <div className="result-item-header">
                        <div className="result-item-info">
                          <Folder className="w-5 h-5" style={{ color: folder.color }} />
                          <div>
                            <h4 className="result-item-title">{folder.title}</h4>
                            {folder.description && (
                              <p className="result-item-description">{folder.description}</p>
                            )}
                          </div>
                        </div>
                        <Eye className="w-4 h-4 cursor-pointer" />
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Tags Results */}
            {tags.length > 0 && (
              <>
                <h3 className="results-category-title">
                  <Tag className="w-5 h-5" /> Tags ({tags.length})
                </h3>
                <div className="results-list">
                  {tags.map((tag) => (
                    <Card
                      key={tag._id}
                      className="search-result-item"
                      onClick={() => router.push(`/dashboard/tags/${tag._id}`)}
                    >
                      <div className="result-item-header">
                        <div className="result-item-info">
                          <div 
                            className="tag-color-dot" 
                            style={{ backgroundColor: tag.color }}
                          />
                          <div>
                            <h4 className="result-item-title">{tag.name}</h4>
                            {tag.description && (
                              <p className="result-item-description">{tag.description}</p>
                            )}
                          </div>
                        </div>
                        <span className="tag-usage-count">{tag.usageCount} uses</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        ) : !loading && !query ? (
          <Card className="empty-results">
            <div className="empty-icon">
              <Search className="w-12 h-12" />
            </div>
            <h3>Start Searching</h3>
            <p>Enter keywords to find your notes, folders, and tags quickly</p>
          </Card>
        ) : null}

        {/* Search Tips */}
        {notes.length === 0 && folders.length === 0 && tags.length === 0 && !query && (
          <Card className="search-tips">
            <h3 className="tips-title">Search Tips</h3>
            <div className="tips-grid">
              {searchTips.map((tip, index) => (
                <div key={index} className="tip-card">
                  <tip.icon className={`w-6 h-6 text-${tip.color}-500`} />
                  <h4>{tip.title}</h4>
                  <p>{tip.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}