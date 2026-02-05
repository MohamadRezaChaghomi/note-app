"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import "./EditFolderPage.css";

const colorOptions = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export default function EditFolderPage({ params }) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: colorOptions[0],
  });

  useEffect(() => {
    if (id) {
      fetchFolder();
    }
  }, [id]);

  const fetchFolder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/folders/${id}`);
      
      if (!res.ok) {
        throw new Error("Failed to fetch folder");
      }
      
      const data = await res.json();
      if (data.ok && data.folder) {
        setFormData({
          title: data.folder.title,
          description: data.folder.description || "",
          color: data.folder.color,
        });
      }
    } catch (error) {
      console.error("Error fetching folder:", error);
      toast.error("Failed to load folder");
      router.push("/folders");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Folder title is required");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/folders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Folder updated successfully!");
      router.push(`/dashboard/folders/${id}`);
    } catch (error) {
      toast.error(error.message || "Failed to update folder");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="edit-folder-page theme-transition">
        <div className="loading-state">
          <Loader2 className="loading-spinner" />
          <p className="loading-text">Loading folder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-folder-page theme-transition">
      <div className="edit-folder-container">
        <div className="edit-folder-header">
          <Link href={`/dashboard/folders/${id}`} className="back-link">
            <ArrowLeft className="back-link-icon" />
            Back to Folder
          </Link>
          
          <div className="header-content">
            <div className="header-icon-container">
              <FolderPlus className="header-icon" />
            </div>
            <h1 className="header-title">Edit Folder</h1>
            <p className="header-subtitle">Update your folder details</p>
          </div>
        </div>

        <div className={`edit-form-container ${saving ? 'loading-form' : ''}`}>
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <label className="form-label required">Folder Name</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter folder name"
                className="form-input"
                required
                disabled={saving}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe what this folder will contain..."
                rows={3}
                className="form-textarea"
                disabled={saving}
              />
            </div>

            <div className="color-selection">
              <label className="form-label">Folder Color</label>
              <div className="color-grid">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange("color", color)}
                    disabled={saving}
                    className={`color-option ${
                      formData.color === color ? "selected" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="preview-section">
              <h3 className="preview-title">Preview</h3>
              <div className="preview-content">
                <div
                  className="preview-icon"
                  style={{ backgroundColor: formData.color }}
                />
                <div className="preview-text">
                  <h4 className="preview-folder-name">{formData.title}</h4>
                  <p className="preview-description">{formData.description}</p>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={saving || !formData.title.trim()}
                className="save-btn"
              >
                {saving ? (
                  <span className="save-btn-saving">
                    <Loader2 className="save-btn-spinner" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={saving}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}