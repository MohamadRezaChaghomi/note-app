// app/dashboard/folders/page.jsx - نسخه جدید با استایل بهتر
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Folder, Trash2, Edit2, FileText, Loader, AlertCircle, ChevronRight, MoreVertical, Users, Lock, Star, Calendar } from "lucide-react";
import "@/styles/folders.css";

export default function FoldersPage() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", color: "#3B82F6", privacy: "private" });
  const [folderStats, setFolderStats] = useState({});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/folders");
      if (!res.ok) throw new Error("Failed to load folders");
      const data = await res.json();
      setFolders(data.folders || []);
      
      // Load stats for each folder
      const stats = {};
      for (const folder of data.folders || []) {
        const notesRes = await fetch(`/api/notes?folderId=${folder._id}`);
        if (notesRes.ok) {
          const notesData = await notesRes.json();
          const notes = notesData.notes || [];
          
          // Calculate stats
          const totalNotes = notes.length;
          const starredNotes = notes.filter(n => n.isStarred).length;
          const recentNotes = notes.filter(n => {
            const date = new Date(n.updatedAt);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return date > weekAgo;
          }).length;
          
          stats[folder._id] = {
            total: totalNotes,
            starred: starredNotes,
            recent: recentNotes,
            lastUpdated: notes.length > 0 
              ? new Date(Math.max(...notes.map(n => new Date(n.updatedAt))))
              : folder.updatedAt
          };
        }
      }
      setFolderStats(stats);
    } catch (err) {
      setError(err.message || "Error loading folders");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFolder = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/folders/${editingId}` : "/api/folders";
      
      const payload = editingId 
        ? { title: formData.title.trim(), color: formData.color }
        : { 
            title: formData.title.trim(), 
            description: formData.description.trim(),
            color: formData.color,
            privacy: formData.privacy
          };
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || `Error: ${res.status}`);
        setSaving(false);
        return;
      }
      
      if (editingId) {
        setFolders(folders.map(f => f._id === editingId ? { ...f, ...data.folder } : f));
        setEditingId(null);
      } else {
        if (data?.folder?._id) {
          setFolders([...folders, data.folder]);
          setFolderStats(prev => ({ 
            ...prev, 
            [data.folder._id]: { total: 0, starred: 0, recent: 0, lastUpdated: data.folder.createdAt }
          }));
        }
      }
      
      setFormData({ title: "", description: "", color: "#3B82F6", privacy: "private" });
      setShowNewForm(false);
    } catch (err) {
      console.error("Save folder error:", err);
      setError(err.message || "Failed to save folder");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const noteCount = folderStats[folderId]?.total || 0;
    const msg = noteCount > 0
      ? `This folder has ${noteCount} notes. Deleting the folder will delete all notes inside it. Are you sure?`
      : "Are you sure you want to delete this folder?";
    
    if (!confirm(msg)) return;

    try {
      const res = await fetch(`/api/folders/${folderId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Failed to delete folder");
        return;
      }

      setFolders(prev => prev.filter(f => f._id !== folderId));
      setFolderStats(prev => {
        const copy = { ...prev };
        delete copy[folderId];
        return copy;
      });
    } catch (err) {
      console.error('Delete folder error:', err);
      setError(err.message || 'Failed to delete folder');
    }
  };

  const handleEdit = (folder) => {
    setEditingId(folder._id);
    setFormData({ 
      title: folder.title, 
      description: folder.description || "",
      color: folder.color || "#3B82F6",
      privacy: folder.privacy || "private"
    });
    setShowNewForm(true);
  };

  const handleCancel = () => {
    setShowNewForm(false);
    setEditingId(null);
    setFormData({ title: "", description: "", color: "#3B82F6", privacy: "private" });
  };

  const handleFolderClick = (folderId) => {
    router.push(`/dashboard/folders/${folderId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="folders-modern-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading folders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="folders-modern-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Folders</h1>
          <p>Organize your notes into folders</p>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-value">{folders.length}</span>
              <span className="stat-label">Total Folders</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {Object.values(folderStats).reduce((sum, stats) => sum + stats.total, 0)}
              </span>
              <span className="stat-label">Total Notes</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {Object.values(folderStats).reduce((sum, stats) => sum + stats.starred, 0)}
              </span>
              <span className="stat-label">Starred Notes</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            setShowNewForm(!showNewForm);
            if (showNewForm) handleCancel();
          }}
          className="create-folder-btn"
        >
          <Plus size={20} />
          New Folder
        </button>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      {/* New Folder Form */}
      {showNewForm && (
        <div className="folder-form-modal">
          <div className="form-header">
            <h3>{editingId ? "Edit Folder" : "Create New Folder"}</h3>
            <button onClick={handleCancel} className="close-form-btn">×</button>
          </div>
          
          <form onSubmit={handleSaveFolder} className="folder-form">
            <div className="form-row">
              <div className="form-group">
                <label>Folder Name *</label>
                <input
                  type="text"
                  placeholder="Enter folder name..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  disabled={saving}
                  autoFocus
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Color</label>
                <div className="color-options">
                  {["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4", "#84CC16"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Optional description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-textarea"
                disabled={saving}
                rows={3}
              />
            </div>
            
            {!editingId && (
              <div className="form-group">
                <label>Privacy</label>
                <div className="privacy-options">
                  <label className="privacy-option">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={formData.privacy === "private"}
                      onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                    />
                    <Lock size={16} />
                    <span>Private</span>
                    <small>Only you can see this folder</small>
                  </label>
                  
                  <label className="privacy-option">
                    <input
                      type="radio"
                      name="privacy"
                      value="shared"
                      checked={formData.privacy === "shared"}
                      onChange={(e) => setFormData({ ...formData, privacy: e.target.value })}
                    />
                    <Users size={16} />
                    <span>Shared</span>
                    <small>Share with specific people</small>
                  </label>
                </div>
              </div>
            )}
            
            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={saving || !formData.title.trim()}>
                {saving ? "Saving..." : editingId ? "Update Folder" : "Create Folder"}
              </button>
              <button type="button" className="btn-cancel" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Folders Grid */}
      {folders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <Folder size={80} />
          </div>
          <h3>No folders yet</h3>
          <p>Create your first folder to organize notes</p>
          <button onClick={() => setShowNewForm(true)} className="btn-create">
            <Plus size={20} />
            Create Folder
          </button>
        </div>
      ) : (
        <div className="folders-grid">
          {folders.map((folder) => {
            const stats = folderStats[folder._id] || { total: 0, starred: 0, recent: 0 };
            const isSelected = selectedFolder === folder._id;
            
            return (
              <div 
                key={folder._id} 
                className={`folder-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleFolderClick(folder._id)}
                onMouseEnter={() => setSelectedFolder(folder._id)}
                onMouseLeave={() => setSelectedFolder(null)}
              >
                <div className="folder-card-header">
                  <div className="folder-icon" style={{ backgroundColor: folder.color || "#3B82F6" }}>
                    <Folder size={24} />
                  </div>
                  
                  <div className="folder-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(folder);
                      }}
                      className="action-btn"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder._id);
                      }}
                      className="action-btn delete"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="folder-content">
                  <h3 className="folder-title">{folder.title}</h3>
                  
                  {folder.description && (
                    <p className="folder-description">{folder.description}</p>
                  )}
                  
                  <div className="folder-stats">
                    <div className="stat-item">
                      <FileText size={14} />
                      <span>{stats.total} notes</span>
                    </div>
                    
                    {stats.starred > 0 && (
                      <div className="stat-item">
                        <Star size={14} />
                        <span>{stats.starred} starred</span>
                      </div>
                    )}
                    
                    {stats.recent > 0 && (
                      <div className="stat-item">
                        <Calendar size={14} />
                        <span>{stats.recent} new</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="folder-footer">
                    <span className="last-updated">
                      {stats.lastUpdated ? `Updated ${formatDate(stats.lastUpdated)}` : 'No notes yet'}
                    </span>
                    
                    {folder.privacy === 'private' ? (
                      <Lock size={14} className="privacy-icon" />
                    ) : (
                      <Users size={14} className="privacy-icon" />
                    )}
                  </div>
                </div>
                
                <ChevronRight size={20} className="folder-arrow" />
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Tips */}
      {folders.length > 0 && (
        <div className="quick-tips">
          <h4>💡 Quick Tips</h4>
          <ul>
            <li>Click on a folder to view its contents</li>
            <li>Drag and drop notes between folders (coming soon)</li>
            <li>Use colors to categorize folders visually</li>
            <li>Share folders with team members</li>
          </ul>
        </div>
      )}
    </div>
  );
}