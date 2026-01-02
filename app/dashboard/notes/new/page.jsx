"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Save, X, AlertCircle, Folder, Palette } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import "@/styles/new-note.css";

export default function NewNotePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    color: "#3b82f6",
    folderId: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/folders");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Failed to load folders (${res.status})`);
      }
      setFolders(data.folders || []);
    } catch (err) {
      console.error("Error loading folders:", err);
      setErrors({ load: "Error loading folders" });
    } finally {
      setLoading(false);
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.folderId) newErrors.folderId = "Folder selection is required";
    return newErrors;
  }, [formData]);

  const handleSave = useCallback(async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content?.trim() || "",
        color: formData.color,
        folderId: formData.folderId
      };

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.message || `Error: ${res.status}` });
        return;
      }

      if (data?.note?._id) {
        router.push(`/dashboard/notes/${data.note._id}`);
      } else {
        setErrors({ submit: "Failed to save note" });
      }
    } catch (error) {
      console.error("Save error:", error);
      setErrors({ submit: "Network error" });
    } finally {
      setSaving(false);
    }
  }, [formData, router, validateForm]);

  const handleCancel = useCallback(() => {
    if (formData.title.trim() || formData.description.trim()) {
      if (confirm("Are you sure you want to discard this note?")) {
        router.push("/dashboard/notes");
      }
    } else {
      router.push("/dashboard/notes");
    }
  }, [formData, router]);

  const colorOptions = useMemo(() => [
    "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", 
    "#06b6d4", "#ec4899"
  ], []);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  if (loading) {
    return (
      <div className="new-note-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading folders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="new-note-container">
      {/* Header */}
      <div className="new-note-header">
        <div className="new-note-header-content">
          <h1>Create New Note</h1>
          <p>Add a new note to your collection</p>
        </div>
        <div className="new-note-actions">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={saving}
            className="btn-cancel"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="btn-save"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </div>

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="error-messages">
          {Object.entries(errors).map(([key, error]) => (
            <div key={key} className="error-message">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="new-note-content">
        {/* Left Panel - Main Content */}
        <Card className="left-panel">
          <div className="form-group">
            <label className="form-label required">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter note title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Write your note content here..."
              className="form-textarea"
              rows={16}
              disabled={saving}
            />
          </div>
        </Card>

        {/* Right Panel - Settings */}
        <Card className="right-panel">
          <div className="form-group">
            <label className="form-label required">
              <Folder className="w-4 h-4 inline mr-2" />
              Folder
            </label>
            <select
              value={formData.folderId}
              onChange={(e) => handleInputChange('folderId', e.target.value)}
              className={`form-input ${errors.folderId ? 'error' : ''}`}
              disabled={saving || folders.length === 0}
            >
              <option value="">Select a folder...</option>
              {folders.map((folder) => (
                <option key={folder._id} value={folder._id}>
                  {folder.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Palette className="w-4 h-4 inline mr-2" />
              Color
            </label>
            <div className="color-picker">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => handleInputChange('color', color)}
                  disabled={saving}
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <p className="helper-text">
              <strong>Note:</strong> Title and folder are required fields.
              Description and color are optional.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}