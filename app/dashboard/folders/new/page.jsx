"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import "@styles/NewFolderPage.css";

const colorOptions = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
];

export default function NewFolderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: colorOptions[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Folder title is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success("Folder created successfully!");
      router.push("/folders");
    } catch (error) {
      toast.error(error.message || "Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="new-folder-page theme-transition">
      <div className="new-folder-container">
        <div className="new-folder-header">
          <Link href="/dashboard/folders" className="back-link">
            <ArrowLeft className="back-link-icon" />
            Back to Folders
          </Link>
          
          <div className="header-content">
            <div className="header-icon-container">
              <FolderPlus className="header-icon" />
            </div>
            <h1 className="header-title">Create New Folder</h1>
            <p className="header-subtitle">Organize your notes with folders</p>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className={loading ? "loading" : ""}>
            <div className="form-field">
              <label className="form-label required">Folder Name</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter folder name"
                className="form-input"
                required
                disabled={loading}
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
                disabled={loading}
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
                    disabled={loading}
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
                disabled={loading || !formData.title.trim()}
                className="submit-btn"
              >
                {loading ? (
                  <span className="submit-btn-loading">
                    <Loader2 className="submit-btn-spinner" />
                    Creating...
                  </span>
                ) : (
                  <>
                    <FolderPlus className="header-icon" />
                    Create Folder
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
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