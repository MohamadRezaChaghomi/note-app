"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FolderPlus,
  Check,
  Folder,
  Lock,
  Unlock,
  Loader2,
  Briefcase,
  User,
  Lightbulb,
  FolderTree,
  Star,
  Archive,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const colorOptions = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
];

const iconOptions = [
  { value: "folder", label: "Folder", icon: Folder },
  { value: "work", label: "Work", icon: Briefcase },
  { value: "personal", label: "Personal", icon: User },
  { value: "ideas", label: "Ideas", icon: Lightbulb },
  { value: "projects", label: "Projects", icon: FolderTree },
  { value: "star", label: "Star", icon: Star },
  { value: "archive", label: "Archive", icon: Archive },
  { value: "trash", label: "Trash", icon: Trash2 },
];

export default function EditFolderPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "#3b82f6",
    icon: "folder",
    isProtected: false,
  });

  const folderId = params.id;

  useEffect(() => {
    if (folderId) {
      fetchFolder();
    }
  }, [folderId]);

  const fetchFolder = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching folder:", folderId);
      
      const res = await fetch(`/api/folders/${folderId}`);
      const data = await res.json();
      
      console.log("📥 Folder response:", data);
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch folder");
      }
      
      if (data.ok && data.folder) {
        setFormData({
          title: data.folder.title || "",
          description: data.folder.description || "",
          color: data.folder.color || "#3b82f6",
          icon: data.folder.icon || "folder",
          isProtected: data.folder.isProtected || false,
        });
        console.log("✅ Folder data loaded:", data.folder);
      } else {
        throw new Error("Invalid folder data");
      }
    } catch (error) {
      console.error("❌ Error fetching folder:", error);
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
      console.log("📤 Updating folder:", formData);
      
      const res = await fetch(`/api/folders/${folderId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("📥 Update response:", data);

      if (!res.ok) {
        if (data.errors) {
          data.errors.forEach(error => toast.error(error));
        } else {
          throw new Error(data.message || `Server error: ${res.status}`);
        }
        return;
      }

      toast.success("Folder updated successfully!");
      
      // Redirect back to folder page
      setTimeout(() => {
        router.push(`/folders/${folderId}`);
      }, 1000);
      
    } catch (error) {
      console.error("❌ Update folder error:", error);
      
      if (error.message.includes("already exists")) {
        toast.error(error.message);
      } else if (error.message.includes("Network") || error.message.includes("Failed to fetch")) {
        toast.error("Cannot connect to server. Please check your connection.");
      } else {
        toast.error(error.message || "Failed to update folder. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const IconComponent = iconOptions.find(icon => icon.value === formData.icon)?.icon || Folder;

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading folder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/folders/${folderId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Folder
        </Link>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <FolderPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Folder
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your folder settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Folder Name *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter folder name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                maxLength={100}
                disabled={saving}
              />
              <p className="mt-2 text-sm text-gray-500">
                Give your folder a descriptive name
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe what this folder will contain..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={500}
                disabled={saving}
              />
              <p className="mt-2 text-sm text-gray-500">
                Maximum 500 characters
              </p>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Folder Color
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange("color", color)}
                    disabled={saving}
                    className={`aspect-square rounded-lg flex items-center justify-center border-2 transition-all ${
                      formData.color === color 
                        ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800" 
                        : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    style={{ backgroundColor: color }}
                    title={`Select ${color}`}
                  >
                    {formData.color === color && (
                      <Check className="w-5 h-5 text-white drop-shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Folder Icon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {iconOptions.map((iconOption) => {
                  const Icon = iconOption.icon;
                  return (
                    <button
                      key={iconOption.value}
                      type="button"
                      onClick={() => handleChange("icon", iconOption.value)}
                      disabled={saving}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center border-2 transition-all ${
                        formData.icon === iconOption.value 
                          ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-100 dark:ring-blue-800/30" 
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      title={`Select ${iconOption.label} icon`}
                    >
                      <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300 mb-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {iconOption.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Protection Toggle */}
            <div className="mb-8">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  {formData.isProtected ? (
                    <Lock className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Unlock className="w-5 h-5 text-gray-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Protected Folder
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Prevent accidental deletion or modification
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isProtected}
                    onChange={(e) => handleChange("isProtected", e.target.checked)}
                    className="sr-only peer"
                    disabled={saving}
                  />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 ${saving ? "opacity-50 cursor-not-allowed" : ""}`}></div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving || !formData.title.trim()}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.push(`/folders/${folderId}`)}
                disabled={saving}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Preview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview
            </h3>
            <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: formData.color }}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formData.title || "Folder Name"}
                  </h4>
                  {formData.description ? (
                    <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {formData.description}
                    </p>
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500 italic mt-1">
                      No description
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    {formData.isProtected && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                        <Lock className="w-3 h-3 mr-1" />
                        Protected
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                      <Folder className="w-3 h-3 mr-1" />
                      {formData.icon.charAt(0).toUpperCase() + formData.icon.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl shadow p-6 border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shadow-sm">
                <Folder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Editing Tips
              </h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Keep folder names clear and descriptive
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Use colors and icons to quickly identify folders
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Protect important folders from accidental changes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  Update descriptions to reflect current contents
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}