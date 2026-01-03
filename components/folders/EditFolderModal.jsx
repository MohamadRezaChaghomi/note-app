"use client";

import { useState, useEffect } from "react";
import {
  X,
  Folder,
  Palette,
  Type,
  Lock,
  Unlock,
  RefreshCw,
  Save,
} from "lucide-react";
import "@styles/components/folders/EditFolderModal.module.css";

export default function EditFolderModal({ folder, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "#3b82f6",
    icon: "folder",
    isProtected: false,
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const iconOptions = [
    { value: "folder", label: "Default", icon: "📁" },
    { value: "archive", label: "Archive", icon: "📦" },
    { value: "trash", label: "Trash", icon: "🗑️" },
    { value: "star", label: "Star", icon: "⭐" },
    { value: "work", label: "Work", icon: "💼" },
    { value: "personal", label: "Personal", icon: "👤" },
    { value: "ideas", label: "Ideas", icon: "💡" },
    { value: "projects", label: "Projects", icon: "📂" },
  ];

  const colorOptions = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#84cc16", // Lime
  ];

  useEffect(() => {
    if (folder) {
      setFormData({
        title: folder.title || "",
        description: folder.description || "",
        color: folder.color || "#3b82f6",
        icon: folder.icon || "folder",
        isProtected: folder.isProtected || false,
      });
    }
  }, [folder]);

  useEffect(() => {
    if (!folder) return;
    
    const changes = 
      formData.title !== folder.title ||
      formData.description !== folder.description ||
      formData.color !== folder.color ||
      formData.icon !== folder.icon ||
      formData.isProtected !== folder.isProtected;
    
    setHasChanges(changes);
  }, [formData, folder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !hasChanges) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    if (folder) {
      setFormData({
        title: folder.title || "",
        description: folder.description || "",
        color: folder.color || "#3b82f6",
        icon: folder.icon || "folder",
        isProtected: folder.isProtected || false,
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Folder className="w-5 h-5" />
            <h2>Edit Folder</h2>
            <span className="folder-name">{folder?.title}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <label className="form-label">
              <Type className="w-4 h-4" />
              Folder Name *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter folder name"
              className="form-input"
              required
              maxLength={100}
              autoFocus
            />
            <div className="form-hint">
              Max 100 characters
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Optional description"
              className="form-textarea"
              rows={3}
              maxLength={500}
            />
            <div className="form-hint">
              Max 500 characters
            </div>
          </div>

          <div className="form-grid">
            <div className="form-section">
              <label className="form-label">
                <Palette className="w-4 h-4" />
                Color
              </label>
              <div className="color-picker">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange("color", color)}
                    className={`color-option ${formData.color === color ? "selected" : ""}`}
                    title={color}
                  >
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-section">
              <label className="form-label">
                <Folder className="w-4 h-4" />
                Icon
              </label>
              <div className="icon-picker">
                {iconOptions.map((icon) => (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => handleChange("icon", icon.value)}
                    className={`icon-option ${formData.icon === icon.value ? "selected" : ""}`}
                    title={icon.label}
                  >
                    <span className="icon-emoji">{icon.icon}</span>
                    <span className="icon-label">{icon.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="toggle-group">
              <label className="toggle-label">
                <div className="toggle-content">
                  {formData.isProtected ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4" />
                  )}
                  <div>
                    <span className="toggle-title">Protected Folder</span>
                    <p className="toggle-description">
                      Prevent accidental deletion or modification
                    </p>
                  </div>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.isProtected}
                    onChange={(e) => handleChange("isProtected", e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <div className="actions-left">
              <button
                type="button"
                onClick={handleReset}
                className="reset-btn"
                disabled={!hasChanges}
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            </div>
            
            <div className="actions-right">
              <button
                type="button"
                onClick={onClose}
                className="secondary-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={loading || !formData.title.trim() || !hasChanges}
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        <div className="folder-preview">
          <div className="preview-header">
            <h4>Preview</h4>
          </div>
          <div className="preview-content">
            <div
              className="preview-icon"
              style={{ backgroundColor: formData.color }}
            >
              <span className="preview-emoji">
                {iconOptions.find(i => i.value === formData.icon)?.icon || "📁"}
              </span>
            </div>
            <div className="preview-details">
              <h5>{formData.title || "Folder Name"}</h5>
              {formData.description && (
                <p>{formData.description}</p>
              )}
              {formData.isProtected && (
                <span className="preview-badge">
                  <Lock className="w-3 h-3" />
                  Protected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}