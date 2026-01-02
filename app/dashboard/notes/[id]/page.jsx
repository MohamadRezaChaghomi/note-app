"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Save, Trash2, Archive, Star, Eye, Clock, Tag,
  MoreVertical, Download, Share2, Lock, Unlock,
  Loader2, AlertCircle, ChevronLeft, ExternalLink,
  Copy, Check, History, Printer, Link as LinkIcon
} from "lucide-react";
import NoteEditor from "@/components/notes/NoteEditor";
import VersionHistory from "@/components/notes/VersionHistory";
import NoteSharing from "@/components/notes/NoteSharing";
import { toast } from "sonner";
import "@/styles/note-detail.css";

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
  const [versions, setVersions] = useState([]);
  const [copied, setCopied] = useState(false);

  const loadNote = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/notes/${id}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || `Failed to load note (${res.status})`;
        throw new Error(msg);
      }
      setNote(data.note);
      
      // Load version history (optional endpoint)
      try {
        const versionsRes = await fetch(`/api/notes/${id}/versions`);
        if (versionsRes.ok) {
          const versionsData = await versionsRes.json();
          setVersions(versionsData.versions || []);
        }
      } catch (e) {
        // Versions endpoint is optional, continue without it
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadNote();
    }
  }, [id]);

  const handleSave = async (patch) => {
    try {
      setSaving(true);
      
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save: ${res.status}`);
      }
      
      const data = await res.json();
      setNote(data.note);
      
      toast.success("Note saved successfully");
      
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleHardDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this note? This action cannot be undone.")) {
      return;
    }

    try {
      await fetch(`/api/notes/${id}?mode=hard`, { method: "DELETE" });
      toast.success("Note permanently deleted");
      router.push("/dashboard/notes");
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  const handleRestore = async () => {
    try {
      await fetch(`/api/notes/${id}?mode=restore`, { method: "DELETE" });
      toast.success("Note restored");
      loadNote();
    } catch (err) {
      toast.error("Failed to restore note");
    }
  };

  const handleToggleStar = async () => {
    if (!note) return;
    
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !note.isStarred })
      });
      
      const data = await res.json();
      setNote(data.note);
      
      toast.success(note.isStarred ? "Note unstarred" : "Note starred");
    } catch (err) {
      toast.error("Failed to update note");
    }
  };

  const handleToggleArchive = async () => {
    if (!note) return;
    
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !note.isArchived })
      });
      
      const data = await res.json();
      setNote(data.note);
      
      toast.success(note.isArchived ? "Note unarchived" : "Note archived");
    } catch (err) {
      toast.error("Failed to update note");
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

  if (loading) {
    return (
      <div className="note-detail-container">
        <div className="loading-state">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Loading note...</p>
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
          <p>{error || "The requested note could not be found or you don't have permission to view it."}</p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => router.push('/dashboard/notes')} className="px-3 py-2 rounded border">Back to Notes</button>
            <button onClick={() => router.push('/dashboard/notes/new')} className="px-3 py-2 rounded bg-primary text-white">Create New Note</button>
            <button onClick={() => { setLoading(true); setError(null); loadNote(); }} className="px-3 py-2 rounded border">Retry</button>
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
            <div className="note-title-section">
              <h1 className="note-title">
                {note.title || "Untitled Note"}
              </h1>
              <div className="note-badges">
                {note.isStarred && (
                  <span className="badge starred">
                    <Star className="w-3 h-3" />
                    Starred
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
              </div>
            </div>
            
            <div className="note-meta">
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
            >
              <Star className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleToggleArchive}
              className={`action-btn ${note.isArchived ? 'active' : ''}`}
              title={note.isArchived ? "Unarchive" : "Archive"}
            >
              <Archive className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowSharing(true)}
              className="action-btn"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleCopyLink}
              className="action-btn"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            </button>
            
            <div className="more-actions-dropdown">
              <button className="action-btn more">
                <MoreVertical className="w-4 h-4" />
              </button>
              
              <div className="dropdown-menu">
                <button
                  onClick={() => setShowHistory(true)}
                  className="dropdown-item"
                >
                  <History className="w-4 h-4" />
                  Version History
                </button>
                
                <button
                  onClick={() => handleExport("pdf")}
                  className="dropdown-item"
                >
                  <Download className="w-4 h-4" />
                  Export as PDF
                </button>
                
                <button
                  onClick={() => handleExport("txt")}
                  className="dropdown-item"
                >
                  <Download className="w-4 h-4" />
                  Export as Text
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="dropdown-item"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                
                <div className="divider" />
                
                {note.isTrashed ? (
                  <button
                    onClick={handleRestore}
                    className="dropdown-item restore"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Restore from Trash
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      fetch(`/api/notes/${id}?mode=trash`, { method: "DELETE" })
                        .then(() => {
                          toast.success("Note moved to trash");
                          router.push("/dashboard/notes");
                        });
                    }}
                    className="dropdown-item trash"
                  >
                    <Trash2 className="w-4 h-4" />
                    Move to Trash
                  </button>
                )}
                
                <button
                  onClick={handleHardDelete}
                  className="dropdown-item delete"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Forever
                </button>
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
      
      {/* Main Editor */}
      <div className="editor-section">
        <NoteEditor
          initial={note}
          onSave={handleSave}
          saving={saving}
          readOnly={note.isTrashed}
        />
      </div>
      
      {/* Modals */}
      {showHistory && (
        <VersionHistory
          versions={versions}
          onClose={() => setShowHistory(false)}
          onRestoreVersion={async (versionId) => {
            try {
              await fetch(`/api/notes/${id}/restore/${versionId}`);
              toast.success("Version restored");
              loadNote();
              setShowHistory(false);
            } catch (err) {
              toast.error("Failed to restore version");
            }
          }}
        />
      )}
      
      {showSharing && (
        <NoteSharing
          note={note}
          onClose={() => setShowSharing(false)}
          onUpdate={loadNote}
        />
      )}
    </div>
  );
}