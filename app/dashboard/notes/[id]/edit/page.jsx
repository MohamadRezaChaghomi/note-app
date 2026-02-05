"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  Save, 
  X, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  FileText,
  Folder,
  Tag as TagIcon
} from "lucide-react";
import { toast } from "sonner";
import "@styles/edit-note-page.css";

export default function EditNotePage() {
  const router = useRouter();
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [folders, setFolders] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    color: "#3b82f6",
    folder: "",
    tags: [],
  });

  const fetchNoteAndResources = useCallback(async () => {
    if (!id || id === 'undefined' || typeof id !== 'string') return;

    try {
      setLoading(true);
      
      // Fetch note
      const noteRes = await fetch(`/api/notes/${id}`);
      const noteData = await noteRes.json();

      if (!noteRes.ok || !noteData.ok) {
        throw new Error(noteData.message || "Failed to load note");
      }

      setNote(noteData.note);
      setFormData({
        title: noteData.note.title || "",
        description: noteData.note.description || "",
        content: noteData.note.content || "",
        color: noteData.note.color || "#3b82f6",
        folder: noteData.note.folder || "",
        tags: noteData.note.tags || [],
      });
      setSelectedTags(noteData.note.tags || []);

      // Fetch folders
      const foldersRes = await fetch("/api/folders");
      if (foldersRes.ok) {
        const foldersData = await foldersRes.json();
        setFolders(foldersData.folders || []);
      }

      // Fetch all tags
      const tagsRes = await fetch("/api/tags");
      if (tagsRes.ok) {
        const tagsData = await tagsRes.json();
        setAllTags(tagsData.tags || []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message || "Failed to load note");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchNoteAndResources();
    }
  }, [id, fetchNoteAndResources]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleTagToggle = (tagId) => {
    setSelectedTags((prev) => {
      const isSelected = prev.includes(tagId);
      if (isSelected) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Note title is required";
    }

    if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Note content is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);

      const dataToSubmit = {
        ...formData,
        tags: selectedTags,
      };

      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update note");
      }

      toast.success("Note updated successfully");
      router.push(`/dashboard/notes/${id}`);
    } catch (error) {
      toast.error(error.message || "Failed to update note");
      setErrors({ submit: error.message });
    } finally {
      setSaving(false);
    }
  };

  const colorOptions = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#94a3b8",
    "#64748b",
  ];

  const wordCount = formData.content.split(/\s+/).filter(w => w).length;
  const charCount = formData.content.length;

  if (loading) {
    return (
      <div className="edit-note-loading">
        <Loader2 className="edit-note-spinner" />
        <p className="edit-note-loading-text">Loading note...</p>
      </div>
    );
  }

  return (
    <div className="edit-note-page theme-transition">
      <div className="edit-note-container">
        {/* Back Button */}
        <Link href={`/dashboard/notes/${id}`} className="back-link">
          <ArrowLeft className="back-link-icon" />
          Back to Note
        </Link>

        {/* Header */}
        <div className="edit-note-header">
          <div className="header-icon-container">
            <FileText className="header-icon" />
          </div>
          <h1 className="header-title">Edit Note</h1>
          <p className="header-subtitle">Update your note details</p>
        </div>

        {/* Form */}
        <div className="edit-note-form-container">
          <form onSubmit={handleSubmit} className="edit-note-form">
            {/* Error message */}
            {errors.submit && (
              <div className="form-error">
                <AlertCircle className="form-error-icon" />
                <p className="form-error-text">{errors.submit}</p>
              </div>
            )}

            {/* Note Title */}
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Note Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter note title"
                maxLength="100"
                className={`form-input ${errors.title ? "form-input-error" : ""}`}
              />
              {errors.title && (
                <p className="form-error-message">{errors.title}</p>
              )}
              <p className="form-char-count">
                {formData.title.length}/100
              </p>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of this note"
                maxLength="200"
                rows="3"
                className={`form-textarea ${errors.description ? "form-input-error" : ""}`}
              />
              {errors.description && (
                <p className="form-error-message">{errors.description}</p>
              )}
              <p className="form-char-count">
                {formData.description.length}/200
              </p>
            </div>

            {/* Content */}
            <div className="form-group">
              <label htmlFor="content" className="form-label">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your note content here..."
                rows="8"
                className={`form-textarea ${errors.content ? "form-input-error" : ""}`}
              />
              {errors.content && (
                <p className="form-error-message">{errors.content}</p>
              )}
              <div className="content-stats">
                <span>Words: {wordCount}</span>
                <span>Characters: {charCount}</span>
              </div>
            </div>

            {/* Color Picker */}
            <div className="form-group">
              <label className="color-picker-label">Note Color</label>
              <div className="color-options">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, color }))
                    }
                    className={`color-option ${formData.color === color ? "color-option-selected" : ""}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Folder Selection */}
            <div className="form-group">
              <label className="form-label">Folder</label>
              <div className="folder-select">
                <select
                  value={formData.folder}
                  onChange={(e) => setFormData(prev => ({ ...prev, folder: e.target.value }))}
                  className="form-input"
                >
                  <option value="">No folder</option>
                  {folders.map((folder) => (
                    <option key={folder._id} value={folder._id}>
                      {folder.title}
                    </option>
                  ))}
                </select>
                <Folder className="folder-select-icon" />
              </div>
            </div>

            {/* Tags Selection */}
            <div className="form-group">
              <label className="form-label">Tags</label>
              <div className="tags-selection">
                <div className="tags-list">
                  {allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag._id);
                    return (
                      <button
                        key={tag._id}
                        type="button"
                        onClick={() => handleTagToggle(tag._id)}
                        className={`tag-option ${isSelected ? "tag-option-selected" : ""}`}
                        style={{
                          backgroundColor: isSelected ? tag.color : 'transparent',
                          borderColor: tag.color,
                          color: isSelected ? 'white' : tag.color
                        }}
                      >
                        <TagIcon className="tag-option-icon" />
                        <span>{tag.name}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedTags.length > 0 && (
                  <div className="selected-tags">
                    <p className="selected-tags-label">Selected tags:</p>
                    <div className="selected-tags-list">
                      {allTags
                        .filter(tag => selectedTags.includes(tag._id))
                        .map((tag) => (
                          <span
                            key={tag._id}
                            className="selected-tag-badge"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.name}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="form-group">
              <label className="preview-label">Preview</label>
              <div className="preview-container">
                <div 
                  className="preview-note-header"
                  style={{ backgroundColor: formData.color + '20' }}
                >
                  <div className="preview-note-color" style={{ backgroundColor: formData.color }} />
                  <h3 className="preview-note-title">
                    {formData.title || "Note Title"}
                  </h3>
                </div>
                {formData.description && (
                  <p className="preview-note-description">{formData.description}</p>
                )}
                {formData.content && (
                  <div className="preview-note-content">
                    <p>{formData.content.substring(0, 150)}...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => router.back()}
                className="form-action-btn form-action-btn-cancel"
              >
                <X className="form-action-icon" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="form-action-btn form-action-btn-submit"
              >
                {saving ? (
                  <>
                    <Loader2 className="form-action-icon form-action-loading" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="form-action-icon" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}