"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Plus, Search, Filter, Star, Archive, Trash2, Folder, 
  Grid, List, Loader2, Calendar, Tag, MoreVertical,
  ChevronRight, ChevronLeft, Eye, Edit, Download,
  Sparkles, Zap, TrendingUp, X, Check, SortAsc,
  Grid3x3, Rows, Columns, SlidersHorizontal, RefreshCw,
  Pin, PinOff, Clock, AlertCircle, Users
} from "lucide-react";
import { toast } from "sonner";
import NoteCard from "@/components/notes/NoteCard";
import NoteGrid from "@/components/notes/NoteGrid";
import NoteList from "@/components/notes/NoteList";
import FilterPanel from "@/components/notes/FilterPanel";
import AdvancedFilterPanel from "@/components/notes/AdvancedFilterPanel";
import BulkActions from "@/components/notes/BulkActions";
import EmptyState from "@/components/notes/EmptyState";
import QuickStats from "@/components/notes/QuickStats";
import "@/styles/notes-page.css";

export default function NotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('updatedAt_desc');
  const [stats, setStats] = useState({
    total: 0,
    starred: 0,
    archived: 0,
    trashed: 0,
    pinned: 0
  });

  const [filters, setFilters] = useState({
    status: 'all',
    folder: null,
    tags: [],
    dateRange: null,
    priority: null,
    showArchived: false,
    showTrashed: false
  });

  const loadNotes = useCallback(async (page = 1, forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: getLimitByViewMode(),
        sort: sortBy,
        ...(searchQuery && { search: searchQuery }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.folder && { folderId: filters.folder }),
        ...(filters.tags.length > 0 && { tags: filters.tags.join(',') }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.showArchived && { showArchived: 'true' }),
        ...(filters.showTrashed && { withTrashed: 'true' })
      });

      if (filters.dateRange?.start) params.append('dateRange', `${filters.dateRange.start},${filters.dateRange.end || ''}`);
      
      const res = await fetch(`/api/notes?${params}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${res.status}: Failed to load notes`);
      }
      
      const data = await res.json();
      
      if (!data.ok) {
        throw new Error(data.message || 'Failed to load notes');
      }
      
      setNotes(data.notes || []);
      setPagination(data.pagination || null);
      
      // Update stats
      if (data.pagination) {
        setStats(prev => ({
          ...prev,
          total: data.pagination.total || 0
        }));
      }
      
    } catch (err) {
      console.error('Load notes error:', err);
      setError(err.message);
      toast.error(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, sortBy, viewMode, searchQuery]);

  const getLimitByViewMode = () => {
    switch(viewMode) {
      case 'compact': return '50';
      case 'list': return '20';
      default: return '12';
    }
  };

  const refreshStats = useCallback(async () => {
    try {
      const [starredRes, archivedRes, trashedRes, pinnedRes] = await Promise.all([
        fetch('/api/notes?status=starred&limit=1'),
        fetch('/api/notes?status=archived&limit=1'),
        fetch('/api/notes?status=trashed&limit=1'),
        fetch('/api/notes?status=pinned&limit=1')
      ]);

      const [starredData, archivedData, trashedData, pinnedData] = await Promise.all([
        starredRes.json(),
        archivedRes.json(),
        trashedRes.json(),
        pinnedRes.json()
      ]);

      setStats({
        total: pagination?.total || 0,
        starred: starredData.pagination?.total || 0,
        archived: archivedData.pagination?.total || 0,
        trashed: trashedData.pagination?.total || 0,
        pinned: pinnedData.pagination?.total || 0
      });
    } catch (err) {
      console.error('Refresh stats error:', err);
    }
  }, [pagination]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (notes.length > 0) {
      refreshStats();
    }
  }, [notes, refreshStats]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleRefresh = () => {
    loadNotes(pagination?.page || 1, true);
  };

  const handleNoteAction = async (noteId, action, data = {}) => {
    try {
      if (action === 'delete') {
        if (!confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) return;
      }

      let endpoint = `/api/notes/${noteId}`;
      let method = 'PATCH';
      let body = data;

      switch(action) {
        case 'delete':
          endpoint = `${endpoint}?mode=hard&force=true`;
          method = 'DELETE';
          body = undefined;
          break;
        case 'trash':
          endpoint = `${endpoint}?mode=trash`;
          method = 'DELETE';
          body = undefined;
          break;
        case 'restore':
          endpoint = `${endpoint}?mode=restore`;
          method = 'DELETE';
          body = undefined;
          break;
        case 'pin':
          body = { pinned: true };
          break;
        case 'unpin':
          body = { pinned: false };
          break;
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || `Action failed (${res.status})`);
      }

      toast.success(getSuccessMessage(action));
      
      // Optimistic update
      if (action === 'delete') {
        setNotes(prev => prev.filter(n => n._id !== noteId));
      } else {
        // Refresh the specific note
        setNotes(prev => prev.map(note => 
          note._id === noteId ? { ...note, ...body, ...result.note } : note
        ));
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
      let endpoint = '/api/notes';
      let method = 'PATCH';
      let body = { noteIds: selectedNotes };

      switch(action) {
        case 'delete':
          if (!confirm(`Are you sure you want to permanently delete ${selectedNotes.length} notes? This action cannot be undone.`)) return;
          // Note: Bulk delete might need separate implementation
          toast.error('Bulk delete not implemented yet');
          return;
        case 'trash':
          body.updates = { isTrashed: true };
          break;
        case 'archive':
          body.updates = { isArchived: true };
          break;
        case 'star':
          body.updates = { isStarred: true };
          break;
        case 'unstar':
          body.updates = { isStarred: false };
          break;
        case 'pin':
          body.updates = { pinned: true };
          break;
        case 'unpin':
          body.updates = { pinned: false };
          break;
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || 'Bulk action failed');
      }

      toast.success(`${selectedNotes.length} notes ${getBulkActionText(action)}`);
      setSelectedNotes([]);
      setBulkMode(false);
      loadNotes(pagination?.page || 1);
      
    } catch (err) {
      console.error('Bulk action error:', err);
      toast.error(err.message || 'Bulk action failed');
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
      delete: 'Note permanently deleted',
      pin: 'Note pinned',
      unpin: 'Note unpinned'
    };
    return messages[action] || 'Action completed';
  };

  const getBulkActionText = (action) => {
    const texts = {
      star: 'starred',
      unstar: 'unstarred',
      archive: 'archived',
      trash: 'moved to trash',
      delete: 'deleted',
      pin: 'pinned',
      unpin: 'unpinned'
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
    { value: 'starred_desc', label: 'Most Starred', icon: Star },
    { value: 'pinnedAt_desc', label: 'Pinned First', icon: Pin }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Notes', icon: Grid3x3, count: stats.total },
    { id: 'starred', label: 'Starred', icon: Star, count: stats.starred },
    { id: 'archived', label: 'Archived', icon: Archive, count: stats.archived },
    { id: 'trashed', label: 'Trash', icon: Trash2, count: stats.trashed },
    { id: 'pinned', label: 'Pinned', icon: Pin, count: stats.pinned }
  ];

  if (loading && !refreshing) {
    return (
      <div className="notes-page">
        <div className="loading-fullscreen">
          <div className="loader-container">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your notes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-page">
      {/* Header */}
      <div className="notes-header">
        <div className="header-content">
          <div className="header-left">
            <div className="page-title">
              <h1>Notes</h1>
              <p className="subtitle">
                {stats.total.toLocaleString()} notes • {filters.status === 'all' ? 'All' : filters.status} • {viewMode} view
              </p>
            </div>
            
            {/* Quick Stats */}
            <QuickStats stats={stats} />
          </div>
          
          <div className="header-right">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="refresh-btn"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
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
                onUnstar={() => handleBulkAction('unstar')}
                onArchive={() => handleBulkAction('archive')}
                onTrash={() => handleBulkAction('trash')}
                onDelete={() => handleBulkAction('delete')}
                onPin={() => handleBulkAction('pin')}
                onUnpin={() => handleBulkAction('unpin')}
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
              disabled={loading}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="clear-search-btn"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
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
                  disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                title="List View"
                disabled={loading}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`view-btn ${viewMode === 'compact' ? 'active' : ''}`}
                title="Compact View"
                disabled={loading}
              >
                <Columns className="w-4 h-4" />
              </button>
            </div>
            
            {/* Filter Buttons */}
            <div className="filter-buttons">
              <button
                onClick={() => {
                  setShowFilters(!showFilters);
                  setShowAdvancedFilters(false);
                }}
                className={`filter-btn ${showFilters ? 'active' : ''}`}
                disabled={loading}
              >
                <Filter className="w-4 h-4" />
                Filters
                {Object.values(filters).some(v => 
                  v !== null && v !== '' && (!Array.isArray(v) || v.length > 0) && v !== 'all'
                ) && (
                  <span className="filter-indicator" />
                )}
              </button>
              
              <button
                onClick={() => {
                  setShowAdvancedFilters(!showAdvancedFilters);
                  setShowFilters(false);
                }}
                className={`filter-btn ${showAdvancedFilters ? 'active' : ''}`}
                disabled={loading}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Advanced
              </button>
            </div>
            
            {/* Bulk Select */}
            <button
              onClick={() => {
                setBulkMode(!bulkMode);
                if (bulkMode) setSelectedNotes([]);
              }}
              className={`bulk-select-btn ${bulkMode ? 'active' : ''}`}
              disabled={loading}
            >
              {bulkMode ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {bulkMode ? 'Done' : 'Select'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter Panels */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFilterChange={(newFilters) => setFilters(newFilters)}
          onClear={() => setFilters({
            status: 'all',
            folder: null,
            tags: [],
            dateRange: null,
            priority: null,
            showArchived: false,
            showTrashed: false
          })}
        />
      )}
      
      {showAdvancedFilters && (
        <AdvancedFilterPanel
          onApplyFilters={(advancedFilters) => {
            setFilters(prev => ({ ...prev, ...advancedFilters }));
            setShowAdvancedFilters(false);
          }}
          onClear={() => {
            setFilters(prev => ({
              ...prev,
              priority: null,
              tags: [],
              dateRange: null,
              folder: null,
              showArchived: false,
              showTrashed: false
            }));
            setShowAdvancedFilters(false);
          }}
          initialFilters={filters}
        />
      )}
      
      {/* Main Content */}
      <div className="notes-content">
        {/* Error State */}
        {error && (
          <div className="error-state">
            <div className="error-icon">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3>Failed to load notes</h3>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button onClick={() => loadNotes(pagination?.page || 1)} className="retry-btn">
                Try Again
              </button>
              <button onClick={() => setError(null)} className="dismiss-btn">
                Dismiss
              </button>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && notes.length === 0 && (
          <EmptyState
            filters={filters}
            onClearFilters={() => setFilters({
              status: 'all',
              folder: null,
              tags: [],
              dateRange: null,
              priority: null,
              showArchived: false,
              showTrashed: false
            })}
            onCreateNote={() => router.push('/dashboard/notes/new')}
          />
        )}
        
        {/* Notes Display */}
        {!loading && !error && notes.length > 0 && (
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
                        <div className="compact-header">
                          <h4 className="compact-title">{note.title || 'Untitled'}</h4>
                          <div className="compact-icons">
                            {note.isStarred && <Star className="w-3 h-3 text-yellow-500" />}
                            {note.isPinned && <Pin className="w-3 h-3 text-blue-500" />}
                            {note.isArchived && <Archive className="w-3 h-3 text-gray-500" />}
                          </div>
                        </div>
                        <div className="compact-meta">
                          <span className="compact-date">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {new Date(note.updatedAt).toLocaleDateString('fa-IR')}
                          </span>
                          {note.tags?.length > 0 && (
                            <span className="compact-tags">
                              <Tag className="w-3 h-3 inline mr-1" />
                              {note.tags.slice(0, 2).map(tag => `#${tag}`).join(', ')}
                            </span>
                          )}
                        </div>
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
                  disabled={pagination.page === 1 || loading}
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
                        disabled={loading}
                        className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => loadNotes(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages || loading}
                  className="pagination-btn next"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                <div className="page-info">
                  Page {pagination.page} of {pagination.totalPages}
                  <span className="total-notes"> • {pagination.total.toLocaleString()} notes</span>
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
              onClick={() => handleBulkAction('pin')}
              className="floating-action-btn"
              title="Pin selected"
            >
              <Pin className="w-4 h-4" />
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