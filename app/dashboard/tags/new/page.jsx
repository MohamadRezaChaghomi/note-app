"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X, AlertCircle, ArrowLeft, Tag as TagIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import "@/styles/new-tag-page.css";

export default function NewTagPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    color: "#3b82f6",
    description: "",
  });

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tag name is required";
    }

    if (formData.name.length > 50) {
      newErrors.name = "Tag name must be less than 50 characters";
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
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

      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create tag");
      }

      toast.success("Tag created successfully");
      router.push("/dashboard/tags");
    } catch (error) {
      toast.error(error.message || "Failed to create tag");
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
  ];

  return (
    <div className="new-tag-page theme-transition">
      <div className="new-tag-container">
        {/* Back Button */}
        <Link href="/dashboard/tags" className="back-link">
          <ArrowLeft className="back-link-icon" />
          Back to Tags
        </Link>

        {/* Header */}
        <div className="new-tag-header">
          <div className="header-icon-container">
            <TagIcon className="header-icon" />
          </div>
          <h1 className="header-title">Create New Tag</h1>
          <p className="header-subtitle">Create a new tag to organize your notes</p>
        </div>

        {/* Form */}
        <div className="new-tag-form-container">
          <form onSubmit={handleSubmit} className="new-tag-form">
            {/* Error message */}
            {errors.submit && (
              <div className="form-error">
                <AlertCircle className="form-error-icon" />
                <p className="form-error-text">{errors.submit}</p>
              </div>
            )}

            {/* Tag Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Tag Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Work, Personal, Important"
                maxLength="50"
                className={`form-input ${errors.name ? "form-input-error" : ""}`}
              />
              {errors.name && (
                <p className="form-error-message">{errors.name}</p>
              )}
              <p className="form-char-count">
                {formData.name.length}/50
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
                placeholder="Optional description for this tag"
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

            {/* Color Picker */}
            <div className="form-group">
              <label className="color-picker-label">Tag Color</label>
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

            {/* Preview */}
            <div className="form-group">
              <label className="preview-label">Preview</label>
              <div className="preview-container">
                <span
                  className="preview-tag"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.name || "Tag Name"}
                </span>
                {formData.description && (
                  <p className="preview-description">{formData.description}</p>
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
                    <span className="form-action-loading" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="form-action-icon" />
                    Create Tag
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