"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  Save, Trash2, Archive, Star, Eye, Clock, Tag,
  MoreVertical, Download, Share2, Lock, Unlock,
  Loader2, AlertCircle, ChevronLeft, ExternalLink,
  Copy, Check, History, Printer, Link as LinkIcon,
  Pin, PinOff, Edit, EyeOff, Calendar, Users,
  X, RefreshCw, Folder, Palette, Zap
} from "lucide-react";
import { toast } from "sonner";
import "@/styles/note-detail.css";

// Dynamic imports
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="editor-loading">Loading editor...</div> }
);

const VersionHistory = dynamic(
  () => import("@/components/notes/VersionHistory"),
  { ssr: false }
);

const NoteSharing = dynamic(
  () => import("@/components/notes/NoteSharing"),
  { ssr: false }
);

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: ""
  });
  const [folders, setFolders] = useState([]);

  const loadNote = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/notes/${id}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || `Failed to load note (${res.status})`);
      }
      
      if (!data.ok || !data.note) {
        throw new Error(data.message || "Note not found");
      }
      
      setNote(data.note);
      setFormData({
        title: data.note.title || "",
        content: data.note.content || "",
        description: data.note.description || ""
      });
      
      // Load folders for move functionality
      const foldersRes = await fetch("/api/folders");
      if (foldersRes.ok) {
        const foldersData = await foldersRes.json();
        setFolders(foldersData.folders || []);
      }
      
    } catch (err) {
      console.error("Load note error:", err);
      setError(err.message);
      toast.error(err.message || "Failed to load note");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadNote();
    }
  }, [id, loadNote]);

  const handleSave = async (patch) => {
    try {
      setSaving(true);
      
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || `Failed to save: ${res.status}`);
      }
      
      setNote(data.note);
      setEditing(false);
      toast.success("Note saved successfully");
      
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save note");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await handleSave(formData);
    } catch (err) {
      // Error already handled in handleSave
    }
  };

  const handleHardDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this note? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/notes/${id}?mode=hard&force=true`, { 
        method: "DELETE" 
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete note");
      }
      
      toast.success("Note permanently deleted");
      router.push("/dashboard/notes");
    } catch (err) {
      toast.error(err.message || "Failed to delete note");
    }
  };

  const handleTrash = async () => {
    try {
      const res = await fetch(`/api/notes/${id}?mode=trash`, { 
        method: "DELETE" 
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to move to trash");
      }
      
      toast.success("Note moved to trash");
      router.push("/dashboard/notes");
    } catch (err) {
      toast.error(err.message || "Failed to move to trash");
    }
  };

  const handleRestore = async () => {
    try {
      const res = await fetch(`/api/notes/${id}?mode=restore`, { 
        method: "DELETE" 
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to restore note");
      }
      
      toast.success("Note restored from trash");
      loadNote();
    } catch (err) {
      toast.error(err.message || "Failed to restore note");
    }
  };

  const handleToggleStar = async () => {
    if (!note) return;
    
    try {
      await handleSave({ isStarred: !note.isStarred });
      toast.success(note.isStarred ? "Note unstarred" : "Note starred");
    } catch (err) {
      // Error already handled
    }
  };

  const handleToggleArchive = async () => {
    if (!note) return;
    
    try {
      await handleSave({ isArchived: !note.isArchived });
      toast.success(note.isArchived ? "Note unarchived" : "Note archived");
    } catch (err) {
      // Error already handled
    }
  };

  const handleTogglePin = async () => {
    if (!note) return;
    
    try {
      await handleSave({ pinned: !note.isPinned });
      toast.success(note.isPinned ? "Note unpinned" : "Note pinned");
    } catch (err) {
      // Error already handled
    }
  };

  const handleToggleLock = async () => {
    if (!note) return;
    
    try {
      await handleSave({ isLocked: !note.isLocked });
      toast.success(note.isLocked ? "Note unlocked" : "Note locked");
    } catch (err) {
      // Error already handled
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/dashboard/notes/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExport = async (format = "pdf") => {
    try {
      const res = await fetch(`/api/notes/${id}/export?format=${format}`);
      
      if (!res.ok) {
        throw new Error(`Export failed: ${res.status}`);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note?.title || 'note'}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Note exported as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error("Failed to export note");
    }
  };

  const handleMoveToFolder = async (folderId) => {
    try {
      await handleSave({ folderId });
      toast.success("Note moved to folder");
    } catch (err) {
      toast.error("Failed to move note");
    }
  };

  const handleDuplicate = async () => {
    try {
      const res = await fetch(`/api/notes/${id}?action=duplicate`, {
        method: "POST"
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to duplicate note");
      }
      
      toast.success("Note duplicated successfully");
      if (data.note?._id) {
        router.push(`/dashboard/notes/${data.note._id}`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to duplicate note");
    }
  };

  if (loading) {
    return (
      <div className="note-detail-container">
        <div className="loading-state">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="note-detail-container">
        <div className="error-state">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3>Note Not Found</h3>
          <p className="error-message">
            {error || "The requested note could not be found or you don't have permission to view it."}
          </p>
          <div className="error-actions">
            <button 
              onClick={() => router.push('/dashboard/notes')} 
              className="btn-secondary"
            >
              Back to Notes
            </button>
            <button 
              onClick={() => router.push('/dashboard/notes/new')} 
              className="btn-primary"
            >
              Create New Note
            </button>
            <button 
              onClick={loadNote} 
              className="btn-retry"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="note-detail-container">
      {/* Header */}
      <header className="note-header">
        <div className="header-left">
          <button
            onClick={() => router.push("/dashboard/notes")}
            className="back-button"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="note-info">
            {editing ? (
              <div className="edit-title">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="title-input"
                  placeholder="Note title"
                  autoFocus
                />
                <div className="edit-actions">
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="save-edit-btn"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        title: note.title || "",
                        content: note.content || "",
                        description: note.description || ""
                      });
                    }}
                    disabled={saving}
                    className="cancel-edit-btn"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="note-title-section">
                <h1 className="note-title">
                  {note.title || "Untitled Note"}
                </h1>
                <button
                  onClick={() => setEditing(true)}
                  className="edit-title-btn"
                  title="Edit title"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="note-badges">
              {note.isStarred && (
                <span className="badge starred">
                  <Star className="w-3 h-3" />
                  Starred
                </span>
              )}
              {note.isPinned && (
                <span className="badge pinned">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
              {note.isArchived && (
                <span className="badge archived">
                  <Archive className="w-3 h-3" />
                  Archived
                </span>
              )}
              {note.isTrashed && (
                <span className="badge trashed">
                  <Trash2 className="w-3 h-3" />
                  In Trash
                </span>
              )}
              {note.isLocked && (
                <span className="badge locked">
                  <Lock className="w-3 h-3" />
                  Locked
                </span>
              )}
              {note.priority && note.priority !== 'medium' && (
                <span className={`badge priority ${note.priority}`}>
                  <Zap className="w-3 h-3" />
                  {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)} Priority
                </span>
              )}
            </div>
            
            <div className="note-meta">
              <div className="meta-item">
                <Folder className="w-4 h-4" />
                <span>{note.folder?.title || "Uncategorized"}</span>
              </div>
              <div className="meta-item">
                <Clock className="w-4 h-4" />
                <span>
                  Updated {new Date(note.updatedAt).toLocaleString('fa-IR')}
                </span>
              </div>
              {note.tags?.length > 0 && (
                <div className="meta-item">
                  <Tag className="w-4 h-4" />
                  <span>{note.tags.length} tags</span>
                </div>
              )}
              {note.dueDate && (
                <div className="meta-item">
                  <Calendar className="w-4 h-4" />
                  <span className={note.isOverdue ? "overdue" : ""}>
                    Due {new Date(note.dueDate).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              )}
              {note.sharedCount > 0 && (
                <div className="meta-item">
                  <Users className="w-4 h-4" />
                  <span>Shared with {note.sharedCount} people</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="header-right">
          {/* Quick Actions */}
          <div className="quick-actions">
            <button
              onClick={handleToggleStar}
              className={`action-btn ${note.isStarred ? 'active' : ''}`}
              title={note.isStarred ? "Unstar" : "Star"}
              disabled={saving}
            >
              <Star className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleTogglePin}
              className={`action-btn ${note.isPinned ? 'active' : ''}`}
              title={note.isPinned ? "Unpin" : "Pin"}
              disabled={saving}
            >
              <Pin className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleToggleArchive}
              className={`action-btn ${note.isArchived ? 'active' : ''}`}
              title={note.isArchived ? "Unarchive" : "Archive"}
              disabled={saving}
            >
              <Archive className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleToggleLock}
              className={`action-btn ${note.isLocked ? 'active' : ''}`}
              title={note.isLocked ? "Unlock" : "Lock"}
              disabled={saving}
            >
              {note.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setShowSharing(true)}
              className="action-btn"
              title="Share"
              disabled={saving}
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleCopyLink}
              className="action-btn"
              title="Copy link"
              disabled={saving}
            >
              {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            </button>
            
            <div className="more-actions-dropdown">
              <button className="action-btn more" disabled={saving}>
                <MoreVertical className="w-4 h-4" />
              </button>
              
              <div className="dropdown-menu">
                <button
                  onClick={handleDuplicate}
                  className="dropdown-item"
                  disabled={saving}
                >
                  <Copy className="w-4 h-4" />
                  Duplicate Note
                </button>
                
                <button
                  onClick={() => setShowHistory(true)}
                  className="dropdown-item"
                  disabled={saving}
                >
                  <History className="w-4 h-4" />
                  Version History
                </button>
                
                <div className="dropdown-divider" />
                
                <div className="dropdown-section">
                  <span className="dropdown-section-title">Export</span>
                  <button
                    onClick={() => handleExport("pdf")}
                    className="dropdown-item"
                    disabled={saving}
                  >
                    <Download className="w-4 h-4" />
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport("txt")}
                    className="dropdown-item"
                    disabled={saving}
                  >
                    <Download className="w-4 h-4" />
                    Export as Text
                  </button>
                  <button
                    onClick={() => handleExport("md")}
                    className="dropdown-item"
                    disabled={saving}
                  >
                    <Download className="w-4 h-4" />
                    Export as Markdown
                  </button>
                </div>
                
                <div className="dropdown-divider" />
                
                <div className="dropdown-section">
                  <span className="dropdown-section-title">Move to Folder</span>
                  {folders
                    .filter(f => f._id !== note.folderId)
                    .slice(0, 5)
                    .map(folder => (
                      <button
                        key={folder._id}
                        onClick={() => handleMoveToFolder(folder._id)}
                        className="dropdown-item"
                        disabled={saving}
                      >
                        <Folder className="w-4 h-4" />
                        {folder.title}
                      </button>
                    ))
                  }
                  {folders.length > 5 && (
                    <button
                      onClick={() => {/* Open folder picker */}}
                      className="dropdown-item"
                      disabled={saving}
                    >
                      <Folder className="w-4 h-4" />
                      More folders...
                    </button>
                  )}
                </div>
                
                <div className="dropdown-divider" />
                
                <button
                  onClick={() => window.print()}
                  className="dropdown-item"
                  disabled={saving}
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                
                <div className="dropdown-divider" />
                
                {note.isTrashed ? (
                  <>
                    <button
                      onClick={handleRestore}
                      className="dropdown-item restore"
                      disabled={saving}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Restore from Trash
                    </button>
                    <button
                      onClick={handleHardDelete}
                      className="dropdown-item delete"
                      disabled={saving}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Forever
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleTrash}
                      className="dropdown-item trash"
                      disabled={saving}
                    >
                      <Trash2 className="w-4 h-4" />
                      Move to Trash
                    </button>
                    <button
                      onClick={handleHardDelete}
                      className="dropdown-item delete"
                      disabled={saving}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Forever
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Save Indicator */}
          <div className="save-indicator">
            {saving ? (
              <div className="saving">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="saved">
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Tags Section */}
      {note.tags?.length > 0 && (
        <div className="tags-section">
          <div className="tags-container">
            {note.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Description */}
      {note.description && (
        <div className="description-section">
          <div className="description-content">
            {note.description}
          </div>
        </div>
      )}
      
      {/* Main Editor */}
      <div className="editor-section">
        {editing ? (
          <div className="editor-wrapper">
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              readOnly={saving || note.isLocked}
              placeholder="Start writing your note..."
            />
            <div className="editor-actions">
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="save-content-btn"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    title: note.title || "",
                    content: note.content || "",
                    description: note.description || ""
                  });
                }}
                disabled={saving}
                className="cancel-content-btn"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="content-viewer">
            <div className="content-actions">
              <button
                onClick={() => setEditing(true)}
                disabled={note.isLocked || note.isTrashed}
                className="edit-content-btn"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div 
              className="note-content"
              dangerouslySetInnerHTML={{ __html: note.content || '<p class="empty-content">No content yet. Click Edit to start writing.</p>' }}
            />
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <VersionHistory
              noteId={id}
              onClose={() => setShowHistory(false)}
              onRestoreVersion={async (versionId) => {
                try {
                  await fetch(`/api/notes/${id}/versions/${versionId}/restore`, {
                    method: 'POST'
                  });
                  toast.success("Version restored");
                  loadNote();
                  setShowHistory(false);
                } catch (err) {
                  toast.error("Failed to restore version");
                }
              }}
            />
          </div>
        </div>
      )}
      
      {showSharing && (
        <div className="modal-overlay" onClick={() => setShowSharing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <NoteSharing
              note={note}
              onClose={() => setShowSharing(false)}
              onUpdate={loadNote}
            />
          </div>
        </div>
      )}
    </div>
  );
}