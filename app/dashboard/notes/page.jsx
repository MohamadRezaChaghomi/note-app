"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Plus, Search, Filter, Star, Archive, Trash2, Folder, 
  Grid, List, Loader2, Calendar, Tag, MoreVertical,
  ChevronRight, ChevronLeft, Eye, Edit, Download,
  Sparkles, Zap, TrendingUp, X, Check, SortAsc,
  Grid3x3, Rows, Columns, SlidersHorizontal
} from "lucide-react";
import { toast } from "sonner";
import NoteCard from "@/components/notes/NoteCard";
import NoteGrid from "@/components/notes/NoteGrid";
import NoteList from "@/components/notes/NoteList";
import FilterPanel from "@/components/notes/FilterPanel";
import BulkActions from "@/components/notes/BulkActions";
import EmptyState from "@/components/notes/EmptyState";
import "@/styles/notes-page.css";

export default function NotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'compact'
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('updatedAt_desc');
  
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'starred', 'archived', 'trashed'
    folder: null,
    tags: [],
    dateRange: null,
    priority: null
  });

  const loadNotes = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page,
        limit: viewMode === 'compact' ? 50 : viewMode === 'list' ? 20 : 12,
        sort: sortBy,
        search: searchQuery,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => 
            value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)
          )
        )
      });
      
      const res = await fetch(`/api/notes?${params}`);
      if (!res.ok) throw new Error('Failed to load notes');
      
      const data = await res.json();
      setNotes(data.notes || []);
      // Debug: log loaded note ids to help trace 404 link issues
      try {
        console.log('Loaded notes IDs:', (data.notes || []).map(n => n._id));
      } catch (e) {
        console.log('Loaded notes (no ids)');
      }
      setPagination(data.pagination);
      
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [filters, sortBy, viewMode, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleNoteAction = async (noteId, action, data = {}) => {
    try {
      if (action === 'delete') {
        if (!confirm('Are you sure you want to delete this note?')) return;
      }

      const res = await fetch(`/api/notes/${noteId}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'delete' ? undefined : JSON.stringify(data)
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.message || `Action failed (${res.status})`);
        return;
      }

      toast.success(getSuccessMessage(action));
      // optimistic update: remove or refresh
      if (action === 'delete') {
        setNotes(prev => prev.filter(n => n._id !== noteId));
      } else {
        // refresh list
        loadNotes(pagination?.page || 1);
      }
      setSelectedNotes(prev => prev.filter(id => id !== noteId));
    } catch (err) {
      console.error('Note action error:', err);
      toast.error(err.message || 'Action failed');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedNotes.length === 0) return;
    
    try {
      const promises = selectedNotes.map(noteId =>
        fetch(`/api/notes/${noteId}`, {
          method: action === 'delete' ? 'DELETE' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: action === 'delete' ? undefined : JSON.stringify({ [action]: true })
        })
      );
      
      await Promise.all(promises);
      toast.success(`${selectedNotes.length} notes ${getBulkActionText(action)}`);
      setSelectedNotes([]);
      setBulkMode(false);
      loadNotes();
    } catch (err) {
      toast.error('Bulk action failed');
    }
  };

  const getSuccessMessage = (action) => {
    const messages = {
      star: 'Note starred',
      unstar: 'Note unstarred',
      archive: 'Note archived',
      unarchive: 'Note unarchived',
      trash: 'Note moved to trash',
      restore: 'Note restored',
      delete: 'Note deleted'
    };
    return messages[action] || 'Action completed';
  };

  const getBulkActionText = (action) => {
    const texts = {
      star: 'starred',
      archive: 'archived',
      trash: 'moved to trash',
      delete: 'deleted'
    };
    return texts[action] || 'updated';
  };

  const handleSelectAll = () => {
    if (selectedNotes.length === notes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(notes.map(note => note._id));
    }
  };

  const sortOptions = [
    { value: 'updatedAt_desc', label: 'Recently Updated', icon: Calendar },
    { value: 'createdAt_desc', label: 'Newest First', icon: Sparkles },
    { value: 'title_asc', label: 'Title A-Z', icon: SortAsc },
    { value: 'priority_desc', label: 'Priority', icon: TrendingUp },
    { value: 'starred_desc', label: 'Most Starred', icon: Star }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Notes', icon: Grid3x3, count: pagination?.total || 0 },
    { id: 'starred', label: 'Starred', icon: Star, count: notes.filter(n => n.isStarred).length },
    { id: 'archived', label: 'Archived', icon: Archive, count: notes.filter(n => n.isArchived).length },
    { id: 'trashed', label: 'Trash', icon: Trash2, count: notes.filter(n => n.isTrashed).length }
  ];

  return (
    <div className="notes-page">
      {/* Header */}
      <div className="notes-header">
        <div className="header-content">
          <div className="header-left">
            <div className="page-title">
              <h1>Notes</h1>
              <p className="subtitle">
                {pagination?.total || 0} notes • {filters.status === 'all' ? 'All' : filters.status}
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat">
                <Star className="w-4 h-4" />
                <span>{notes.filter(n => n.isStarred).length} starred</span>
              </div>
              <div className="stat">
                <Zap className="w-4 h-4" />
                <span>{notes.filter(n => !n.isArchived && !n.isTrashed).length} active</span>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            {/* New Note Button */}
            <button
              onClick={() => router.push('/dashboard/notes/new')}
              className="new-note-btn"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>
            
            {/* Bulk Actions */}
            {selectedNotes.length > 0 && (
              <BulkActions
                count={selectedNotes.length}
                onStar={() => handleBulkAction('star')}
                onArchive={() => handleBulkAction('archive')}
                onTrash={() => handleBulkAction('trash')}
                onDelete={() => handleBulkAction('delete')}
                onCancel={() => {
                  setSelectedNotes([]);
                  setBulkMode(false);
                }}
              />
            )}
          </div>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-container">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              name="search"
              type="text"
              placeholder="Search notes by title, content, or tags..."
              defaultValue={searchQuery}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="clear-search-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="submit" className="search-btn">
              Search
            </button>
          </div>
        </form>
        
        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-left">
            {/* Filter Tabs */}
            <div className="filter-tabs">
              {filterOptions.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilters(prev => ({ ...prev, status: filter.id }))}
                  className={`filter-tab ${filters.status === filter.id ? 'active' : ''}`}
                >
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                  {filter.count > 0 && (
                    <span className="count-badge">{filter.count}</span>
                  )}
                </button>
              ))}
            </div>
            
            {/* Sort Dropdown */}
            <div className="sort-dropdown">
              <SortAsc className="w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="toolbar-right">
            {/* View Toggle */}
            <div className="view-toggle">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
                title="Compact View"
              >
                <Columns className="w-4 h-4" />
              </button>
            </div>
            
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`filter-btn ${showFilters ? 'active' : ''}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {Object.values(filters).some(v => 
                v !== null && v !== '' && (!Array.isArray(v) || v.length > 0) && v !== 'all'
              ) && (
                <span className="filter-indicator" />
              )}
            </button>
            
            {/* Bulk Select */}
            <button
              onClick={() => {
                setBulkMode(!bulkMode);
                if (bulkMode) setSelectedNotes([]);
              }}
              className={`bulk-select-btn ${bulkMode ? 'active' : ''}`}
            >
              {bulkMode ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {bulkMode ? 'Done' : 'Select'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
          onClear={() => setFilters({
            status: 'all',
            folder: null,
            tags: [],
            dateRange: null,
            priority: null
          })}
        />
      )}
      
      {/* Main Content */}
      <div className="notes-content">
        {/* Loading State */}
        {loading && notes.length === 0 && (
          <div className="loading-state">
            <div className="loader">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <p>Loading your notes...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="error-state">
            <div className="error-icon">
              <X className="w-12 h-12" />
            </div>
            <h3>Failed to load notes</h3>
            <p>{error}</p>
            <button onClick={() => loadNotes()} className="retry-btn">
              Try Again
            </button>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && notes.length === 0 && (
          <EmptyState
            filters={filters}
            onClearFilters={() => setFilters({
              status: 'all',
              folder: null,
              tags: [],
              dateRange: null,
              priority: null
            })}
            onCreateNote={() => router.push('/dashboard/notes/new')}
          />
        )}
        
        {/* Notes Display */}
        {!loading && notes.length > 0 && (
          <>
            {/* Select All */}
            {bulkMode && (
              <div className="select-all-bar">
                <label className="select-all-label">
                  <input
                    type="checkbox"
                    checked={selectedNotes.length === notes.length}
                    onChange={handleSelectAll}
                    className="select-all-checkbox"
                  />
                  <span>
                    {selectedNotes.length === notes.length
                      ? 'Deselect all'
                      : `Select all ${notes.length} notes`
                    }
                  </span>
                </label>
                <div className="selected-count">
                  {selectedNotes.length} selected
                </div>
              </div>
            )}
            
            {/* Notes Grid/List */}
            <div className={`notes-display ${viewMode}`}>
              {viewMode === 'grid' && (
                <NoteGrid
                  notes={notes}
                  selectedNotes={selectedNotes}
                  bulkMode={bulkMode}
                  onSelectNote={(noteId) => {
                    setSelectedNotes(prev =>
                      prev.includes(noteId)
                        ? prev.filter(id => id !== noteId)
                        : [...prev, noteId]
                    );
                  }}
                  onNoteAction={handleNoteAction}
                  onViewNote={(note) => router.push(`/dashboard/notes/${note._id}`)}
                />
              )}
              
              {viewMode === 'list' && (
                <NoteList
                  notes={notes}
                  selectedNotes={selectedNotes}
                  bulkMode={bulkMode}
                  onSelectNote={(noteId) => {
                    setSelectedNotes(prev =>
                      prev.includes(noteId)
                        ? prev.filter(id => id !== noteId)
                        : [...prev, noteId]
                    );
                  }}
                  onNoteAction={handleNoteAction}
                  onViewNote={(note) => router.push(`/dashboard/notes/${note._id}`)}
                />
              )}
              
              {viewMode === 'compact' && (
                <div className="notes-compact">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className={`compact-note ${selectedNotes.includes(note._id) ? 'selected' : ''}`}
                      onClick={() => {
                        if (bulkMode) {
                          setSelectedNotes(prev =>
                            prev.includes(note._id)
                              ? prev.filter(id => id !== note._id)
                              : [...prev, note._id]
                          );
                        } else {
                          router.push(`/dashboard/notes/${note._id}`);
                        }
                      }}
                    >
                      {bulkMode && (
                        <div className="compact-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedNotes.includes(note._id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              setSelectedNotes(prev =>
                                prev.includes(note._id)
                                  ? prev.filter(id => id !== note._id)
                                  : [...prev, note._id]
                              );
                            }}
                          />
                        </div>
                      )}
                      <div className="compact-content">
                        <h4 className="compact-title">{note.title || 'Untitled'}</h4>
                        <div className="compact-meta">
                          <span className="compact-date">
                            {new Date(note.updatedAt).toLocaleDateString('fa-IR')}
                          </span>
                          {note.tags?.length > 0 && (
                            <span className="compact-tags">
                              {note.tags.slice(0, 2).map(tag => `#${tag}`).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="compact-actions">
                        {note.isStarred && <Star className="w-3 h-3 text-yellow-500" />}
                        {note.isArchived && <Archive className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => loadNotes(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="pagination-btn prev"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => loadNotes(pageNum)}
                        className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => loadNotes(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="pagination-btn next"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <div className="page-info">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Floating Actions */}
      <div className="floating-actions">
        <button
          onClick={() => router.push('/dashboard/notes/new')}
          className="floating-action-btn primary"
          title="New Note"
        >
          <Plus className="w-5 h-5" />
        </button>
        
        {selectedNotes.length > 0 && (
          <div className="floating-bulk-actions">
            <button
              onClick={() => handleBulkAction('star')}
              className="floating-action-btn"
              title="Star selected"
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleBulkAction('archive')}
              className="floating-action-btn"
              title="Archive selected"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleBulkAction('trash')}
              className="floating-action-btn danger"
              title="Move to trash"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}