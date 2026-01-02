// app/dashboard/notes/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Star, Archive, Trash2, Calendar, Folder, Tag, AlertCircle, Save, X, Loader2 } from "lucide-react";
import "@/styles/folder-detail.css";

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id;

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    color: "#FFFFFF",
    folderId: ""
  });
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    if (noteId) {
      loadNote();
      loadFolders();
    }
  }, [noteId]);

  const loadNote = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/notes/${noteId}`);
      if (!res.ok) {
        throw new Error("Note not found");
      }
      const data = await res.json();
      setNote(data.note);
      setFormData({
        title: data.note.title || "",
        description: data.note.description || "",
        content: data.note.content || "",
        color: data.note.color || "#FFFFFF",
        folderId: data.note.folderId || ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const res = await fetch("/api/folders");
      if (res.ok) {
        const data = await res.json();
        setFolders(data.folders || []);
      }
    } catch (err) {
      console.error("Error loading folders:", err);
    }
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          content: formData.content.trim(),
          color: formData.color,
          folderId: formData.folderId
        })
      });

      if (!res.ok) throw new Error("Failed to update note");
      
      const data = await res.json();
      setNote(data.note);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (action) => {
    try {
      let body = {};
      let method = "PATCH";
      
      switch (action) {
        case 'star':
          body.isStarred = true;
          break;
        case 'unstar':
          body.isStarred = false;
          break;
        case 'archive':
          body.isArchived = true;
          break;
        case 'unarchive':
          body.isArchived = false;
          break;
        case 'trash':
          method = "DELETE";
          break;
      }

      const url = action === 'trash' 
        ? `/api/notes/${noteId}?mode=trash`
        : `/api/notes/${noteId}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        ...(method === "PATCH" && { body: JSON.stringify(body) })
      });

      if (!res.ok) throw new Error(`Failed to ${action} note`);
      
      if (action === 'trash') {
        router.push("/dashboard/notes");
      } else {
        loadNote();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    if (editing) {
      setFormData({
        title: note.title || "",
        description: note.description || "",
        content: note.content || "",
        color: note.color || "#FFFFFF",
        folderId: note.folderId || ""
      });
      setEditing(false);
    } else {
      router.back();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="note-detail-page">
        <div className="loading-state">
          <Loader2 className="spinner" size={40} />
          <p>Loading note...</p>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="note-detail-page">
        <button onClick={() => router.back()} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>Note Not Found</h3>
          <p>{error || "The requested note could not be found"}</p>
          <button onClick={() => router.push("/dashboard/notes")} className="btn btn-primary">
            Go to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="note-detail-page">
      {/* Header */}
      <div className="note-header">
        <div className="header-top">
          <button onClick={handleCancel} className="back-button">
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="header-actions">
            {!editing ? (
              <>
                <button 
                  onClick={() => handleAction(note.isStarred ? 'unstar' : 'star')}
                  className={`action-btn ${note.isStarred ? 'active' : ''}`}
                  title={note.isStarred ? "Unstar" : "Star"}
                >
                  <Star size={18} />
                  <span>{note.isStarred ? "Starred" : "Star"}</span>
                </button>
                
                <button 
                  onClick={() => handleAction(note.isArchived ? 'unarchive' : 'archive')}
                  className={`action-btn ${note.isArchived ? 'active' : ''}`}
                  title={note.isArchived ? "Unarchive" : "Archive"}
                >
                  <Archive size={18} />
                  <span>{note.isArchived ? "Archived" : "Archive"}</span>
                </button>
                
                <button 
                  onClick={() => setEditing(true)}
                  className="action-btn primary"
                  title="Edit"
                >
                  <Edit size={18} />
                  <span>Edit</span>
                </button>
                
                <button 
                  onClick={() => handleAction('trash')}
                  className="action-btn danger"
                  title="Move to Trash"
                >
                  <Trash2 size={18} />
                  <span>Trash</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleUpdate}
                  className="action-btn primary"
                  disabled={saving}
                >
                  <Save size={18} />
                  <span>{saving ? "Saving..." : "Save"}</span>
                </button>
                
                <button 
                  onClick={handleCancel}
                  className="action-btn"
                  disabled={saving}
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>

        {editing ? (
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="edit-title"
            placeholder="Note title..."
            autoFocus
          />
        ) : (
          <h1 className="note-title">{note.title}</h1>
        )}
        
        <div className="note-meta">
          <div className="meta-item">
            <Calendar size={16} />
            <span>Created: {formatDate(note.createdAt)}</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} />
            <span>Updated: {formatDate(note.updatedAt)}</span>
          </div>
          {note.folderId && (
            <div className="meta-item">
              <Folder size={16} />
              <span>
                {folders.find(f => f._id === note.folderId)?.title || "Folder"}
              </span>
            </div>
          )}
          {note.tags && note.tags.length > 0 && (
            <div className="meta-item">
              <Tag size={16} />
              <div className="tags">
                {note.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="note-content">
        {editing ? (
          <textarea
            value={formData.description || formData.content}
            onChange={(e) => setFormData({...formData, description: e.target.value, content: e.target.value})}
            className="edit-content"
            placeholder="Write your note content here..."
            rows={20}
          />
        ) : (
          <div className="note-body">
            {note.description ? (
              <div className="description">
                {note.description.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ) : note.content ? (
              <div className="content">
                {note.content}
              </div>
            ) : (
              <div className="empty-content">
                <p>No content yet. Add some content to this note.</p>
              </div>
            )}
          </div>
        )}

        {/* Sidebar (for editing) */}
        {editing && (
          <div className="edit-sidebar">
            <div className="sidebar-section">
              <h3>Folder</h3>
              <select
                value={formData.folderId}
                onChange={(e) => setFormData({...formData, folderId: e.target.value})}
                className="folder-select"
              >
                <option value="">Select folder...</option>
                {folders.map(folder => (
                  <option key={folder._id} value={folder._id}>
                    {folder.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="sidebar-section">
              <h3>Color</h3>
              <div className="color-picker">
                {["#FFFFFF", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE"].map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData({...formData, color})}
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Tags</h3>
              <p className="info-text">Coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Badges */}
      {(note.isStarred || note.isArchived) && (
        <div className="status-badges">
          {note.isStarred && (
            <span className="status-badge starred">
              <Star size={14} />
              Starred
            </span>
          )}
          {note.isArchived && (
            <span className="status-badge archived">
              <Archive size={14} />
              Archived
            </span>
          )}
        </div>
      )}
    </div>
  );
}