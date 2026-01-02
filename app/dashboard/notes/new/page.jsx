"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X, AlertCircle } from "lucide-react";
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
    color: "#FFFFFF",
    folderId: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/folders");
      const data = await res.json().catch(() => ({}));
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
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.folderId) newErrors.folderId = "Folder selection is required";
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
        content: formData.content?.trim() || "",
        color: formData.color,
        folderId: formData.folderId
      };

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
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
  };

  const handleCancel = () => {
    if (formData.title || formData.description) {
      if (confirm("Are you sure?")) {
        router.push("/dashboard/notes");
      }
    } else {
      router.push("/dashboard/notes");
    }
  };

  if (loading) {
    return (
      <div className="editor-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">New Note</h1>
        <div className="flex gap-2">
          <button onClick={handleCancel} className="px-3 py-2 rounded border text-sm" disabled={saving}>
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded bg-primary text-white text-sm" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="mb-4">
          {Object.values(errors).map((error, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-3 py-2 rounded mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border rounded-lg p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Note title..."
                className={`w-full border rounded px-3 py-2 ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Write full description or content here..."
                className="w-full border rounded px-3 py-3 min-h-[320px] resize-vertical"
                rows={18}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <aside className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Folder *</label>
              <select
                value={formData.folderId}
                onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                className={`w-full border rounded px-3 py-2 ${errors.folderId ? 'border-red-400' : 'border-gray-200'}`}
                disabled={saving}
              >
                <option value="">Select folder...</option>
                {folders.map((folder) => (
                  <option key={folder._id} value={folder._id}>
                    {folder.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <div className="flex flex-wrap gap-2">
                {["#FFFFFF", "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE"].map((color) => (
                  <button
                    key={color}
                    aria-label={color}
                    onClick={() => setFormData({ ...formData, color })}
                    disabled={saving}
                    className={`w-8 h-8 rounded ${formData.color === color ? 'ring-2 ring-offset-1 ring-primary' : 'border'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Only title and folder are required. Description and color are optional.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}