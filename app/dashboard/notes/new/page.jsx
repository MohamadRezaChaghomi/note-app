"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save, X, Bold, Italic, List, Link, Image,
  Paperclip, Smile, Code, Eye, EyeOff,
  Loader2, AlertCircle, CheckCircle
} from "lucide-react";
import "@/styles/editor.css";

export default function NewNotePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    isStarred: false,
    isArchived: false
  });
  const [preview, setPreview] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    return newErrors;
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFormat = (format) => {
    const textarea = document.querySelector(".editor-textarea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    let newText = formData.content;
    
    switch(format) {
      case 'bold':
        newText = formData.content.substring(0, start) + 
                 `**${selectedText}**` + 
                 formData.content.substring(end);
        break;
      case 'italic':
        newText = formData.content.substring(0, start) + 
                 `*${selectedText}*` + 
                 formData.content.substring(end);
        break;
      case 'list':
        newText = formData.content.substring(0, start) + 
                 `\n- ${selectedText}` + 
                 formData.content.substring(end);
        break;
      case 'code':
        newText = formData.content.substring(0, start) + 
                 `\`\`\`\n${selectedText}\n\`\`\`` + 
                 formData.content.substring(end);
        break;
    }
    
    setFormData(prev => ({ ...prev, content: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + format.length, end + format.length);
    }, 0);
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setErrors({});
    
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data?.note?._id) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/dashboard/notes/${data.note._id}`);
        }, 1500);
      } else {
        setErrors({ submit: "Failed to save note. Please try again." });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please check your connection." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (confirm("Are you sure you want to discard this note?")) {
        router.push("/dashboard/notes");
      }
    } else {
      router.push("/dashboard/notes");
    }
  };

  return (
    <div className="editor-container">
      {/* Header */}
      <div className="editor-header">
        <div className="header-content">
          <div>
            <h1 className="editor-title">Create New Note</h1>
            <p className="editor-subtitle">
              Write your thoughts, ideas, or important information
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={handleCancel}
              className="cancel-btn"
              disabled={saving}
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="save-btn"
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <CheckCircle className="w-5 h-5" />
            <span>Note saved successfully! Redirecting...</span>
          </div>
        )}

        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="error-messages">
            {Object.values(errors).map((error, index) => (
              <div key={index} className="error-message">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Main */}
      <div className="editor-main">
        {/* Title Section */}
        <div className="title-section">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Note title..."
            className={`title-input ${errors.title ? 'error' : ''}`}
            disabled={saving}
          />
          {errors.title && (
            <div className="input-error">{errors.title}</div>
          )}
        </div>

        {/* Toolbar */}
        <div className="editor-toolbar">
          <div className="toolbar-left">
            <div className="format-buttons">
              <button
                onClick={() => handleFormat('bold')}
                className="format-btn"
                title="Bold"
                disabled={saving}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormat('italic')}
                className="format-btn"
                title="Italic"
                disabled={saving}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormat('list')}
                className="format-btn"
                title="List"
                disabled={saving}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFormat('code')}
                className="format-btn"
                title="Code Block"
                disabled={saving}
              >
                <Code className="w-4 h-4" />
              </button>
              <button className="format-btn" title="Insert Link" disabled={saving}>
                <Link className="w-4 h-4" />
              </button>
              <button className="format-btn" title="Insert Image" disabled={saving}>
                <Image className="w-4 h-4" />
              </button>
              <button className="format-btn" title="Attach File" disabled={saving}>
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="format-btn" title="Emoji" disabled={saving}>
                <Smile className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="toolbar-right">
            <button
              onClick={() => setPreview(!preview)}
              className="preview-btn"
              disabled={saving}
            >
              {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="editor-content">
          {preview ? (
            <div className="preview-panel">
              <div className="preview-content">
                <h1 className="preview-title">{formData.title || "Untitled"}</h1>
                <div className="preview-body">
                  {formData.content.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="preview-h1">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="preview-h2">{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="preview-h3">{line.substring(4)}</h3>;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <strong key={index} className="preview-bold">{line.substring(2, line.length - 2)}</strong>;
                    } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
                      return <em key={index} className="preview-italic">{line.substring(1, line.length - 1)}</em>;
                    } else if (line.startsWith('- ')) {
                      return <li key={index} className="preview-list-item">{line.substring(2)}</li>;
                    } else if (line.startsWith('```')) {
                      return <pre key={index} className="preview-code">{line.substring(3)}</pre>;
                    }
                    return <p key={index} className="preview-paragraph">{line}</p>;
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className={`editor-panel ${errors.content ? 'error' : ''}`}>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Start typing your note here..."
                className="editor-textarea"
                disabled={saving}
                rows={20}
              />
              {errors.content && (
                <div className="textarea-error">{errors.content}</div>
              )}
            </div>
          )}

          {/* Sidebar */}
          <div className="editor-sidebar">
            {/* Tags Section */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Tags</h3>
              <p className="sidebar-subtitle">Add tags to organize your note</p>
              
              <div className="tags-input-wrapper">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add a tag..."
                  className="tag-input"
                  disabled={saving}
                />
                <button
                  onClick={handleAddTag}
                  className="add-tag-btn"
                  disabled={saving}
                >
                  Add
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="tags-container">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="tag-item">
                      <span className="tag-text">#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="remove-tag-btn"
                        disabled={saving}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <input
                    type="checkbox"
                    id="starred"
                    checked={formData.isStarred}
                    onChange={(e) => setFormData(prev => ({ ...prev, isStarred: e.target.checked }))}
                    className="setting-checkbox"
                    disabled={saving}
                  />
                  <label htmlFor="starred" className="setting-label">
                    <div className="setting-icon starred">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="setting-title">Star this note</div>
                      <div className="setting-description">Mark as important</div>
                    </div>
                  </label>
                </div>

                <div className="setting-item">
                  <input
                    type="checkbox"
                    id="archived"
                    checked={formData.isArchived}
                    onChange={(e) => setFormData(prev => ({ ...prev, isArchived: e.target.checked }))}
                    className="setting-checkbox"
                    disabled={saving}
                  />
                  <label htmlFor="archived" className="setting-label">
                    <div className="setting-icon archived">
                      <Archive className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="setting-title">Archive</div>
                      <div className="setting-description">Hide from main view</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="sidebar-section">
              <h3 className="sidebar-title">Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">
                    {formData.content.split(' ').filter(w => w.length > 0).length}
                  </div>
                  <div className="stat-label">Words</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {formData.content.length}
                  </div>
                  <div className="stat-label">Characters</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {formData.content.split('\n').length}
                  </div>
                  <div className="stat-label">Lines</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {formData.tags.length}
                  </div>
                  <div className="stat-label">Tags</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="quick-actions-bar">
        <button
          onClick={() => handleFormat('bold')}
          className="quick-action-btn"
          disabled={saving}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleFormat('italic')}
          className="quick-action-btn"
          disabled={saving}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleFormat('list')}
          className="quick-action-btn"
          disabled={saving}
          title="List"
        >
          <List className="w-4 h-4" />
        </button>
        <div className="divider" />
        <button
          onClick={handleSave}
          className="quick-save-btn"
          disabled={saving}
          title="Save"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}