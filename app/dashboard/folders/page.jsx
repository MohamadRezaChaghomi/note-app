"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Folder, Trash2, Edit2, FileText, Loader2, AlertCircle } from "lucide-react";
import "@/styles/folders.css";

export default function FoldersPage() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [folderNotes, setFolderNotes] = useState({}); // map of folderId -> note count
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

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
      
      // load note counts for each folder
      const counts = {};
      for (const folder of data.folders || []) {
        const notesRes = await fetch(`/api/notes?folderId=${folder._id}&limit=1`);
        if (notesRes.ok) {
          const notesData = await notesRes.json();
          counts[folder._id] = notesData.notes?.length || 0;
        }
      }
      setFolderNotes(counts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFolder = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSaving(true);
    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `/api/folders/${editingId}` : "/api/folders";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to save folder");
      
      if (editingId) {
        setFolders(folders.map(f => f._id === editingId ? { ...f, ...formData } : f));
        setEditingId(null);
      } else {
        const data = await res.json();
        setFolders([...folders, data.folder]);
      }
      
      setFormData({ title: "", description: "" });
      setShowNewForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    const noteCount = folderNotes[folderId] || 0;
    const msg = noteCount > 0
      ? `This folder contains ${noteCount} note(s). Deleting this folder will also delete all notes inside it. Are you sure?`
      : "Are you sure you want to delete this folder?";
    
    if (!confirm(msg)) return;

    try {
      const res = await fetch(`/api/folders/${folderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete folder");
      
      setFolders(folders.filter(f => f._id !== folderId));
      const newCounts = { ...folderNotes };
      delete newCounts[folderId];
      setFolderNotes(newCounts);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (folder) => {
    setEditingId(folder._id);
    setFormData({ title: folder.title, description: folder.description });
    setShowNewForm(true);
  };

  const handleCancel = () => {
    setShowNewForm(false);
    setEditingId(null);
    setFormData({ title: "", description: "" });
  };

  if (loading) {
    return (
      <div className="folders-page">
        <div className="loading-state">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading folders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="folders-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-title">
          <h1>Folders</h1>
          <p>{folders.length} folder{folders.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => {
            setShowNewForm(!showNewForm);
            if (showNewForm) handleCancel();
          }}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Folder
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      {/* New/Edit Form */}
      {showNewForm && (
        <div className="form-card">
          <h3 className="form-title">{editingId ? "Edit Folder" : "Create New Folder"}</h3>
          <form onSubmit={handleSaveFolder}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Folder name..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="form-input"
                disabled={saving}
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="form-textarea"
                disabled={saving}
                rows={2}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={saving || !formData.title.trim()}>
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Folders List */}
      <div className="folders-list">
        {folders.length === 0 ? (
          <div className="empty-state">
            <Folder className="w-12 h-12 text-gray-300" />
            <h3>No folders yet</h3>
            <p>Create your first folder to organize your notes</p>
            <button onClick={() => setShowNewForm(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Create Folder
            </button>
          </div>
        ) : (
          folders.map((folder) => (
            <div key={folder._id} className="folder-item">
              <div className="folder-icon">
                <Folder className="w-8 h-8" />
              </div>
              <div className="folder-info">
                <h3 className="folder-name">{folder.title}</h3>
                {folder.description && <p className="folder-desc">{folder.description}</p>}
                <div className="folder-meta">
                  <span className="meta-item">
                    <FileText className="w-4 h-4" />
                    {folderNotes[folder._id] || 0} note{folderNotes[folder._id] !== 1 ? 's' : ''}
                  </span>
                  <span className="meta-date">
                    {new Date(folder.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              </div>
              <div className="folder-actions">
                <button
                  onClick={() => router.push(`/dashboard/folders/${folder._id}`)}
                  className="action-btn view"
                  title="View folder"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(folder)}
                  className="action-btn edit"
                  title="Edit folder"
                  disabled={saving}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFolder(folder._id)}
                  className="action-btn delete"
                  title="Delete folder"
                  disabled={saving}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
