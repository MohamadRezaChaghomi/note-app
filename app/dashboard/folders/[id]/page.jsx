"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Folder,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Calendar,
  FileText,
  MoreVertical,
  Share2,
  Star,
  Archive,
  FolderTree,
  Briefcase,
  User,
  Lightbulb,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Clock,
  Tag,
  Users,
  Download,
  Copy,
  Move,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";

// تابع برای گرفتن آیکون بر اساس مقدار icon
const getIconComponent = (iconName) => {
  const iconMap = {
    folder: Folder,
    work: Briefcase,
    personal: User,
    ideas: Lightbulb,
    projects: FolderTree,
    star: Star,
    archive: Archive,
    trash: Trash2,
  };
  return iconMap[iconName] || Folder;
};

export default function FolderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [subfolders, setSubfolders] = useState([]);
  const [stats, setStats] = useState(null);

  const folderId = params.id;

  useEffect(() => {
    if (folderId) {
      fetchFolder();
      fetchFolderNotes();
      fetchFolderStats();
      fetchSubfolders();
    }
  }, [folderId]);

  const fetchFolder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/folders/${folderId}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch folder");
      }
      
      setFolder(data.folder);
    } catch (error) {
      console.error("Error fetching folder:", error);
      toast.error("Failed to load folder");
      router.push("/folders");
    } finally {
      setLoading(false);
    }
  };

  const fetchFolderNotes = async () => {
    try {
      setNotesLoading(true);
      const res = await fetch(`/api/folders/${folderId}/notes`);
      const data = await res.json();
      
      if (res.ok) {
        setNotes(data.notes || []);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setNotesLoading(false);
    }
  };

  const fetchFolderStats = async () => {
    try {
      const res = await fetch(`/api/folders/${folderId}/stats`);
      const data = await res.json();
      
      if (res.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchSubfolders = async () => {
    try {
      const res = await fetch(`/api/folders?parentId=${folderId}`);
      const data = await res.json();
      
      if (res.ok) {
        setSubfolders(data.folders || []);
      }
    } catch (error) {
      console.error("Error fetching subfolders:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this folder? All notes in this folder will be moved to trash.")) return;
    
    try {
      const res = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete folder");
      }
      
      toast.success("Folder deleted successfully");
      router.push("/folders");
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Failed to delete folder");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDuplicateFolder = async () => {
    try {
      const res = await fetch(`/api/folders/${folderId}/duplicate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to duplicate folder");
      }
      
      toast.success("Folder duplicated successfully");
      router.push(`/folders/${data.folder._id}`);
    } catch (error) {
      console.error("Error duplicating folder:", error);
      toast.error("Failed to duplicate folder");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading folder details...</p>
        </div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center py-12">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Folder Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The folder you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link
            href="/folders"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Folders
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = getIconComponent(folder.icon);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/folders" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Folders
            </Link>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
            {folder.title}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ backgroundColor: folder.color }}
            >
              <IconComponent className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {folder.title}
                </h1>
                {folder.isProtected && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                    <Lock className="w-3 h-3 mr-1" />
                    Protected
                  </span>
                )}
              </div>
              
              {folder.description ? (
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-3">
                  {folder.description}
                </p>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 italic mb-3">
                  No description provided
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {formatDate(folder.createdAt)}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Updated {formatDate(folder.updatedAt)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push(`/folders/${folderId}/edit`)}
              className="inline-flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            
            <button
              onClick={handleDuplicateFolder}
              className="inline-flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </button>
            
            <div className="relative group">
              <button className="inline-flex items-center px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Delete folder
                </button>
                <button
                  onClick={() => router.push(`/folders/${folderId}/move`)}
                  className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  Move to another folder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-5 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Notes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats?.totalNotes || notes.length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 rounded-xl p-5 border border-green-100 dark:border-green-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Subfolders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats?.subfoldersCount || subfolders.length}
                  </p>
                </div>
                <Folder className="w-8 h-8 text-green-500 dark:text-green-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-5 border border-purple-100 dark:border-purple-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Archived</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats?.archivedNotes || 0}
                  </p>
                </div>
                <Archive className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notes
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  All notes in this folder
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push(`/notes/new?folderId=${folderId}`)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </button>
              </div>
            </div>
            
            {notesLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="group p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all hover:shadow-sm"
                    onClick={() => router.push(`/notes/${note._id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {note.title}
                          </h3>
                          {note.isStarred && (
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        {note.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {note.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span>{formatDate(note.updatedAt)}</span>
                          {note.tags?.length > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {note.tags.slice(0, 2).map((tag, index) => (
                                  <span key={index} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                                    {tag}
                                  </span>
                                ))}
                                {note.tags.length > 2 && (
                                  <span>+{note.tags.length - 2}</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <MoreVertical className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notes yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  Start by creating your first note in this folder. Organize your thoughts, ideas, and information.
                </p>
                <button
                  onClick={() => router.push(`/notes/new?folderId=${folderId}`)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Note
                </button>
              </div>
            )}
          </div>

          {/* Subfolders Section */}
          {subfolders.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Subfolders
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Folders inside this folder
                  </p>
                </div>
                <button
                  onClick={() => router.push(`/folders/new?parentId=${folderId}`)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Subfolder
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subfolders.map((subfolder) => (
                  <div
                    key={subfolder._id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all group"
                    onClick={() => router.push(`/folders/${subfolder._id}`)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: subfolder.color }}
                      >
                        {React.createElement(getIconComponent(subfolder.icon), {
                          className: "w-5 h-5 text-white"
                        })}
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {subfolder.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {subfolder.noteCount || 0} notes
                      </span>
                      <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Actions Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/notes/new?folderId=${folderId}`)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">New Note</span>
                </div>
                <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </button>
              
              <button
                onClick={() => router.push(`/folders/new?parentId=${folderId}`)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                    <FolderPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">New Subfolder</span>
                </div>
                <Plus className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </button>
              
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">Share Folder</span>
                </div>
                <Share2 className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
              </button>
              
              <button
                onClick={() => router.push(`/folders/${folderId}/export`)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mr-3">
                    <Download className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">Export Folder</span>
                </div>
                <Download className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
              </button>
            </div>
          </div>

          {/* Folder Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Folder Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Folder ID</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                    {folderId.substring(0, 8)}...
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(folderId);
                      toast.success("Folder ID copied to clipboard");
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <div className="flex items-center gap-2">
                  {folder.isProtected ? (
                    <>
                      <Lock className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        Protected
                      </span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Unlocked
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Color</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: folder.color }}
                  />
                  <span className="font-mono text-sm">{folder.color}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Icon</span>
                <div className="flex items-center gap-2">
                  <IconComponent className="w-4 h-4" />
                  <span className="capitalize">{folder.icon}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created</span>
                <div className="text-right">
                  <div className="text-gray-900 dark:text-white font-medium">
                    {formatDate(folder.createdAt)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(folder.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-xl shadow-lg p-6 border border-indigo-100 dark:border-indigo-800/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <Folder className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Storage</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Folder usage</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Notes</span>
                <span className="font-medium">{notes.length} items</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((notes.length / 50) * 100, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm mt-4">
                <span className="text-gray-700 dark:text-gray-300">Subfolders</span>
                <span className="font-medium">{subfolders.length} items</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((subfolders.length / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}