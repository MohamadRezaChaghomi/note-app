"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Folder,
  FolderPlus,
  Search,
  Grid,
  List,
  FolderTree,
  Filter,
  RefreshCw,
  ChevronRight,
  MoreVertical,
  FileText,
  Loader2,
  BarChart,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import FolderCard from "@/components/folders/FolderCard";
import FolderStats from "@/components/folders/FolderStats";

export default function FoldersPage() {
  const router = useRouter();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("order_asc");
  const [stats, setStats] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        withNoteCount: "true",
        sort: sortBy,
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(`/api/folders?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setFolders(data.folders || []);
    } catch (error) {
      toast.error(error.message || "Failed to load folders");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/folders?view=stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }, []);

  useEffect(() => {
    loadFolders();
    loadStats();
  }, [loadFolders, loadStats]);

  const handleFolderClick = (folder) => {
    router.push(`/folders/${folder._id}`);
  };

  const handleFolderAction = (action, folder) => {
    setSelectedFolder(folder);
    switch (action) {
      case "edit":
        router.push(`/folders/${folder._id}/edit`);
        break;
      case "delete":
        // Show delete confirmation
        if (confirm(`Delete "${folder.title}"?`)) {
          deleteFolder(folder._id);
        }
        break;
      case "view":
        router.push(`/folders/${folder._id}`);
        break;
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Folder deleted successfully");
      loadFolders();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Folders
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Organize your notes into folders
            </p>
          </div>
          <Link
            href="/dashboard/folders/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FolderPlus className="w-5 h-5 mr-2" />
            New Folder
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow" : ""}`}
                title="Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow" : ""}`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("tree")}
                className={`p-2 rounded ${viewMode === "tree" ? "bg-white dark:bg-gray-700 shadow" : ""}`}
                title="Tree View"
              >
                <FolderTree className="w-5 h-5" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="order_asc">Custom Order</option>
              <option value="title_asc">Title A-Z</option>
              <option value="createdAt_desc">Newest First</option>
              <option value="updatedAt_desc">Recently Updated</option>
            </select>

            <button
              onClick={loadFolders}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && <FolderStats stats={stats} />}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : folders.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No folders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first folder to organize your notes
          </p>
          <Link
            href="/dashboard/folders/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FolderPlus className="w-5 h-5 mr-2" />
            Create Your First Folder
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <FolderCard
              key={folder._id}
              folder={folder}
              onClick={() => handleFolderClick(folder)}
              onAction={(action) => handleFolderAction(action, folder)}
            />
          ))}
        </div>
      ) : viewMode === "list" ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleFolderClick(folder)}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                style={{ backgroundColor: folder.color }}
              >
                <Folder className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {folder.title}
                </h3>
                {folder.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {folder.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FileText className="w-4 h-4 mr-1" />
                  {folder.noteCount || 0}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFolder(folder);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {/* Tree view implementation */}
          <p className="text-gray-600 dark:text-gray-400">
            Tree view will be implemented here
          </p>
        </div>
      )}
    </div>
  );
}