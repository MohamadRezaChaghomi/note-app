"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  X,
  Loader2,
  RefreshCw,
  Grid,
  List,
  Star,
  Trash2,
  Edit,
  Eye,
  MoreVertical,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import NoteCard from "@/components/notes/NoteCard";
import DeleteModal from "@/components/ui/DeleteModal";
import "@/styles/notes-page.css";

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("updatedAt_desc");
  const [stats, setStats] = useState({
    total: 0,
    starred: 0,
    archived: 0,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    noteId: null,
    noteName: "",
    isLoading: false,
  });

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        limit: "50",
        sort: sortBy,
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(`/api/notes?${params}`);
      const data = await res.json();

      if (!data.ok) {
        throw new Error(data.message || "Failed to load notes");
      }

      setNotes(data.notes || []);
      
      // Calculate simple stats
      if (data.notes) {
        setStats({
          total: data.pagination?.total || data.notes.length,
          starred: data.notes.filter(n => n.isStarred).length,
          archived: data.notes.filter(n => n.isArchived).length,
        });
      }
    } catch (error) {
      console.error("Load notes error:", error);
      toast.error(error.message || "Failed to load notes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, sortBy]);

  const refreshAll = useCallback(() => {
    setRefreshing(true);
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleDeleteNote = (noteId) => {
    const note = notes.find(n => n._id === noteId);
    setDeleteModal({
      isOpen: true,
      noteId,
      noteName: note?.title || "Untitled",
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`/api/notes/${deleteModal.noteId}?mode=hard&force=true`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete note");
      }

      toast.success("Note deleted successfully");
      setDeleteModal({
        isOpen: false,
        noteId: null,
        noteName: "",
        isLoading: false,
      });
      refreshAll();
    } catch (error) {
      toast.error(error.message || "Failed to delete note");
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      noteId: null,
      noteName: "",
      isLoading: false,
    });
  };

  const handleToggleFavorite = async (noteId) => {
    try {
      const note = notes.find(n => n._id === noteId);
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !note?.isStarred }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      toast.success("Note updated");
      loadNotes();
    } catch (error) {
      toast.error(error.message || "Failed to update note");
    }
  };

  const sortOptions = [
    { value: "updatedAt_desc", label: "Recently Updated" },
    { value: "createdAt_desc", label: "Newest First" },
    { value: "title_asc", label: "Title A-Z" },
    { value: "starred_desc", label: "Most Starred" },
  ];

  if (loading && !refreshing) {
    return (
      <div className="notes-page">
        <div className="notes-page-container">
          <div className="notes-loading-fullscreen">
            <div className="notes-loader-container">
              <Loader2 className="notes-loader-spinner animate-spin" />
              <p className="notes-loading-text">Loading notes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-page">
      <div className="notes-page-container">
        {/* Header */}
        <div className="notes-header">
          <div className="notes-header-content">
            <div className="notes-header-left">
              <div className="notes-page-title">
                <h1>Notes</h1>
                <p className="notes-subtitle">
                  {notes.length} note{notes.length !== 1 ? "s" : ""}
                  {stats && ` • ${stats.starred} starred`}
                </p>
              </div>
            </div>

            <div className="notes-header-right">
              {/* Refresh Button */}
              <button
                onClick={refreshAll}
                disabled={refreshing}
                className="notes-refresh-btn"
                title="Refresh"
              >
                <RefreshCw className={`notes-refresh-icon ${refreshing ? "animate-spin" : ""}`} />
              </button>

              {/* New Note Button */}
              <button
                onClick={() => router.push("/dashboard/notes/new")}
                className="new-note-btn"
              >
                <Plus className="new-note-icon" />
                New Note
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="notes-search-container">
            <div className="notes-search-wrapper">
              <Search className="notes-search-icon" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="notes-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="notes-clear-search-btn"
                >
                  <X className="notes-clear-search-icon" />
                </button>
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div className="notes-toolbar">
            <div className="notes-toolbar-left">
              {/* View Toggle */}
              <div className="notes-view-toggle">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`notes-view-btn ${viewMode === "grid" ? "active" : ""}`}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`notes-view-btn ${viewMode === "list" ? "active" : ""}`}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div className="notes-toolbar-right">
              {/* Sort Dropdown */}
              <div className="notes-sort-wrapper">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="notes-sort-select"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!loading && notes.length === 0 && (
          <div className="notes-empty-state">
            <div className="notes-empty-icon">
              <FileText size={48} />
            </div>
            <h3 className="notes-empty-title">No notes yet</h3>
            <p className="notes-empty-description">
              {searchQuery
                ? "Try a different search term"
                : "Create your first note to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push("/dashboard/notes/new")}
                className="notes-empty-action-btn"
              >
                <Plus size={18} />
                Create Note
              </button>
            )}
          </div>
        )}

        {/* Notes Display */}
        {!loading && notes.length > 0 && (
          <div className={`notes-display notes-${viewMode}`}>
            {viewMode === "grid" && (
              <div className="notes-grid">
                {notes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onView={(note) => router.push(`/dashboard/notes/${note._id}`)}
                    onEdit={(noteId) => router.push(`/dashboard/notes/${noteId}`)}
                    onDelete={() => handleDeleteNote(note._id)}
                    onToggleFavorite={() => handleToggleFavorite(note._id)}
                  />
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="notes-list">
                {notes.map((note) => (
                  <div key={note._id} className="notes-list-item">
                    <div className="notes-list-content">
                      <h4 className="notes-list-title">{note.title || "Untitled"}</h4>
                      {note.description && (
                        <p className="notes-list-preview">{note.description.substring(0, 100)}...</p>
                      )}
                    </div>
                    <div className="notes-list-actions">
                      <button
                        onClick={() => handleToggleFavorite(note._id)}
                        className="notes-list-action-btn"
                        title="Toggle favorite"
                      >
                        <Star size={16} fill={note.isStarred ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/notes/${note._id}`)}
                        className="notes-list-action-btn"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note._id)}
                        className="notes-list-action-btn notes-delete-btn"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        itemName={deleteModal.noteName}
        isLoading={deleteModal.isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
