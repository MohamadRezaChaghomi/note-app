"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  Save, X, AlertCircle, Folder, Palette, 
  Clock, Tag, Star, Lock,
  Loader2, Plus
} from "lucide-react";
import { toast } from "sonner";
import "@/styles/new-note.css";

// Dynamic import for rich text editor
const RichTextEditor = dynamic(
  () => import("@/components/editor/RichTextEditor"),
  { ssr: false, loading: () => <div className="editor-loading">Loading editor...</div> }
);

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
    folderId: "",
    tags: [],
    priority: "medium",
    dueDate: "",
    isStarred: false,
    isLocked: false
  });
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/folders");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || `Failed to load folders (${res.status})`);
      }
      
      setFolders(data.folders || []);
      
      // Set default folder if available
      if (data.folders?.length > 0) {
        setFormData(prev => ({ ...prev, folderId: data.folders[0]._id }));
      }
    } catch (err) {
      console.error("Error loading folders:", err);
      toast.error("Failed to load folders");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title cannot exceed 200 characters";
    }
    
    if (!formData.folderId) {
      newErrors.folderId = "Please select a folder";
    }
    
    if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }
    
    return newErrors;
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
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content || "",
        color: formData.color,
        folderId: formData.folderId,
        tags: formData.tags,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        isStarred: formData.isStarred,
        isLocked: formData.isLocked,
        pinned: false
      };

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || `Error: ${res.status}`);
      }

      if (data?.note?._id) {
        toast.success("Note created successfully!");
        router.push(`/dashboard/notes/${data.note._id}`);
      } else {
        throw new Error("Failed to create note: No note ID returned");
      }
    } catch (error) {
      console.error("Save error:", error);
      setErrors({ submit: error.message || "Failed to create note" });
      toast.error(error.message || "Failed to create note");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (formData.title.trim() || formData.description.trim() || formData.content.trim()) {
      if (confirm("Are you sure you want to discard this note? All changes will be lost.")) {
        router.push("/dashboard/notes");
      }
    } else {
      router.push("/dashboard/notes");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const colorOptions = [
    { value: "#3b82f6", label: "Blue", class: "bg-blue-500" },
    { value: "#8b5cf6", label: "Purple", class: "bg-purple-500" },
    { value: "#10b981", label: "Green", class: "bg-green-500" },
    { value: "#f59e0b", label: "Amber", class: "bg-amber-500" },
    { value: "#ef4444", label: "Red", class: "bg-red-500" },
    { value: "#06b6d4", label: "Cyan", class: "bg-cyan-500" },
    { value: "#ec4899", label: "Pink", class: "bg-pink-500" },
    { value: "#f97316", label: "Orange", class: "bg-orange-500" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "text-green-600 bg-green-50" },
    { value: "medium", label: "Medium", color: "text-yellow-600 bg-yellow-50" },
    { value: "high", label: "High", color: "text-red-600 bg-red-50" }
  ];

  if (loading) {
    return (
      <div className="new-note-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading editor...</p>
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
          <button
            onClick={handleCancel}
            disabled={saving}
            className="btn-cancel"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-save"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Note
              </>
            )}
          </button>
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
        <div className="left-panel">
          {/* Title Input */}
          <div className="form-section">
            <label className="form-label required">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter note title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              disabled={saving}
              maxLength={200}
            />
            <div className="input-counter">
              {formData.title.length}/200
            </div>
          </div>

          {/* Description */}
          <div className="form-section">
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your note..."
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              rows={3}
              disabled={saving}
              maxLength={500}
            />
            <div className="input-counter">
              {formData.description.length}/500
            </div>
          </div>

          {/* Content Editor */}
          <div className="form-section">
            <label className="form-label">Content</label>
            <div className="editor-wrapper">
              <RichTextEditor
                value={formData.content}
                onChange={(content) => handleInputChange('content', content)}
                readOnly={saving}
                placeholder="Write your note content here..."
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Settings */}
        <div className="right-panel">
          {/* Folder Selection */}
          <div className="form-section">
            <label className="form-label required">
              <Folder className="w-4 h-4" />
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
            {folders.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No folders found. <a href="/dashboard/folders" className="text-primary-600 hover:underline">Create a folder first</a>
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="form-section">
            <label className="form-label">
              <Star className="w-4 h-4" />
              Priority
            </label>
            <div className="priority-options">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('priority', option.value)}
                  className={`priority-option ${formData.priority === option.value ? 'selected' : ''} ${option.color}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="form-section">
            <label className="form-label">
              <Palette className="w-4 h-4" />
              Color
            </label>
            <div className="color-picker">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color', color.value)}
                  disabled={saving}
                  className={`color-option ${formData.color === color.value ? 'selected' : ''} ${color.class}`}
                  aria-label={`Select ${color.label} color`}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="form-section">
            <label className="form-label">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <div className="tags-input">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
                className="tag-input-field"
                disabled={saving}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={saving || !tagInput.trim()}
                className="add-tag-btn"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="tags-list">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="remove-tag"
                      disabled={saving}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="form-section">
            <label className="form-label">
              <Clock className="w-4 h-4" />
              Due Date
            </label>
            <input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="form-input"
              disabled={saving}
            />
          </div>

          {/* Toggles */}
          <div className="form-section toggles">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={formData.isStarred}
                onChange={(e) => handleInputChange('isStarred', e.target.checked)}
                className="toggle-checkbox"
                disabled={saving}
              />
              <Star className="w-4 h-4" />
              <span>Star this note</span>
            </label>
            
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={formData.isLocked}
                onChange={(e) => handleInputChange('isLocked', e.target.checked)}
                className="toggle-checkbox"
                disabled={saving}
              />
              <Lock className="w-4 h-4" />
              <span>Lock note (read-only)</span>
            </label>
          </div>

          {/* Helper Text */}
          <div className="helper-text">
            <p>
              <strong>Note:</strong> Title and folder are required fields.
              All other fields are optional.
            </p>
            <p className="mt-2">
              You can always edit these settings later from the note details page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}