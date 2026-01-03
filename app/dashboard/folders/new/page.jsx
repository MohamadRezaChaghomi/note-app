"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderPlus, Palette, Type, Folder, Lock, Unlock, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import "@/styles/new-folder.css"
const iconOptions = [
  { value: "folder", label: "Default", icon: Folder },
  { value: "archive", label: "Archive", icon: Archive },
  { value: "trash", label: "Trash", icon: Trash2 },
  { value: "star", label: "Star", icon: Star },
  { value: "work", label: "Work", icon: Briefcase },
  { value: "personal", label: "Personal", icon: User },
  { value: "ideas", label: "Ideas", icon: Lightbulb },
  { value: "projects", label: "Projects", icon: FolderTree },
];

const colorOptions = [
  { value: "#3b82f6", label: "Blue", color: "#3b82f6" },
  { value: "#10b981", label: "Green", color: "#10b981" },
  { value: "#f59e0b", label: "Amber", color: "#f59e0b" },
  { value: "#ef4444", label: "Red", color: "#ef4444" },
  { value: "#8b5cf6", label: "Purple", color: "#8b5cf6" },
  { value: "#ec4899", label: "Pink", color: "#ec4899" },
  { value: "#06b6d4", label: "Cyan", color: "#06b6d4" },
  { value: "#84cc16", label: "Lime", color: "#84cc16" },
];

export default function NewFolderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "#3b82f6",
    icon: "folder",
    isProtected: false,
    parentId: null,
    createDefaultSubfolders: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create folder");
      }

      toast.success("Folder created successfully");
      router.push(`/folders/${data.folder._id}`);
      router.refresh();
    } catch (error) {
      console.error("Create folder error:", error);
      toast.error(error.message || "Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="new-folder-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <Link href="/folders" className="back-link">
            <ArrowLeft className="w-5 h-5" />
            Back to Folders
          </Link>
          <div className="header-title">
            <FolderPlus className="w-8 h-8 text-primary-600" />
            <h1>Create New Folder</h1>
            <p className="subtitle">Organize your notes with custom folders</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="form-container">
        <form onSubmit={handleSubmit} className="folder-form">
          {/* Title Section */}
          <div className="form-section">
            <div className="section-header">
              <Type className="w-5 h-5" />
              <h3>Basic Information</h3>
            </div>
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Folder Name *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter folder name"
                className="form-input"
                required
                maxLength={100}
              />
              <div className="form-help">
                Give your folder a descriptive name (max 100 characters)
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Optional description for your folder"
                className="form-textarea"
                rows={3}
                maxLength={500}
              />
              <div className="form-help">
                Describe what this folder will contain (max 500 characters)
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="form-section">
            <div className="section-header">
              <Palette className="w-5 h-5" />
              <h3>Appearance</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Folder Color</label>
              <div className="color-grid">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange("color", color.value)}
                    className={`color-option ${formData.color === color.value ? "selected" : ""}`}
                    title={color.label}
                  >
                    <div
                      className="color-preview"
                      style={{ backgroundColor: color.color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Folder Icon</label>
              <div className="icon-grid">
                {iconOptions.map((iconOption) => {
                  const Icon = iconOption.icon;
                  return (
                    <button
                      key={iconOption.value}
                      type="button"
                      onClick={() => handleChange("icon", iconOption.value)}
                      className={`icon-option ${formData.icon === iconOption.value ? "selected" : ""}`}
                      title={iconOption.label}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="icon-label">{iconOption.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="form-section">
            <div className="section-header">
              <Settings className="w-5 h-5" />
              <h3>Settings</h3>
            </div>

            <div className="form-group">
              <label className="toggle-label">
                <div className="toggle-content">
                  <Lock className="w-4 h-4" />
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

            <div className="form-group">
              <label className="toggle-label">
                <div className="toggle-content">
                  <Folder className="w-4 h-4" />
                  <div>
                    <span className="toggle-title">Create Default Subfolders</span>
                    <p className="toggle-description">
                      Automatically create Notes, Archive, and Trash subfolders
                    </p>
                  </div>
                </div>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.createDefaultSubfolders}
                    onChange={(e) => handleChange("createDefaultSubfolders", e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => router.back()}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !formData.title.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4" />
                  Create Folder
                </>
              )}
            </button>
          </div>
        </form>

        {/* Preview Panel */}
        <div className="preview-panel">
          <div className="preview-header">
            <h3>Preview</h3>
            <p>See how your folder will look</p>
          </div>
          <div className="folder-preview">
            <div className="preview-folder">
              <div
                className="folder-icon-preview"
                style={{ backgroundColor: formData.color }}
              >
                {(() => {
                  const Icon = iconOptions.find(i => i.value === formData.icon)?.icon || Folder;
                  return <Icon className="w-8 h-8" />;
                })()}
              </div>
              <div className="folder-details-preview">
                <h4 className="folder-title-preview">
                  {formData.title || "Folder Name"}
                </h4>
                {formData.description && (
                  <p className="folder-description-preview">
                    {formData.description}
                  </p>
                )}
                <div className="folder-meta-preview">
                  <span className="meta-tag">
                    {formData.isProtected ? "Protected" : "Standard"}
                  </span>
                  <span className="meta-tag">
                    {formData.createDefaultSubfolders ? "With Subfolders" : "Empty"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="tips-section">
            <div className="tips-header">
              <Info className="w-5 h-5" />
              <h4>Tips for organizing</h4>
            </div>
            <ul className="tips-list">
              <li>Use clear, descriptive names for easy searching</li>
              <li>Different colors can help categorize folders visually</li>
              <li>Protected folders prevent accidental changes</li>
              <li>Consider creating subfolders for better organization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
