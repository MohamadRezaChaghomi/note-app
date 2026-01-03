"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Folder,
  Edit,
  Trash2,
  Plus,
  FileText,
  FolderOpen,
  Archive,
  Users,
  Clock,
  Lock,
  Unlock,
  MoreVertical,
  ChevronRight,
  BarChart,
  Copy,
  Move,
  Download,
  Share2,
  Tag,
  Calendar,
  Eye,
  EyeOff,
  Loader2,
  Grid,
  List,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import NotesList from "@/components/notes/NotesList";
import SubfoldersGrid from "@/components/folders/SubfoldersGrid";
import FolderActions from "@/components/folders/FolderActions";
import FolderInfoCard from "@/components/folders/FolderInfoCard";

export default function FolderDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [folder, setFolder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [subfolders, setSubfolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesView, setNotesView] = useState("grid"); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [stats, setStats] = useState({
    totalNotes: 0,
    archivedNotes: 0,
    subfoldersCount: 0,
  });

  const loadFolderData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [folderRes, notesRes, subfoldersRes, statsRes] = await Promise.all([
        fetch(`/api/folders/${id}`),
        fetch(`/api/folders/${id}/notes`),
        fetch(`/api/folders?parentId=${id}&withNoteCount=true`),
        fetch(`/api/folders/${id}/stats`),
      ]);

      if (!folderRes.ok) {
        throw new Error("Folder not found");
      }

      const folderData = await folderRes.json();
      const notesData = await notesRes.json();
      const subfoldersData = await subfoldersRes.json();
      const statsData = await statsRes.json();

      setFolder(folderData.folder);
      setNotes(notesData.notes || []);
      setSubfolders(subfoldersData.folders || []);
      setStats(statsData.stats || {
        totalNotes: notesData.notes?.length || 0,
        archivedNotes: 0,
        subfoldersCount: subfoldersData.folders?.length || 0,
      });
    } catch (error) {
      console.error("Load folder error:", error);
      toast.error(error.message || "Failed to load folder");
      router.push("/folders");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      loadFolderData();
    }
  }, [id, loadFolderData]);

  const handleCreateNote = () => {
    router.push(`/notes/new?folderId=${id}`);
  };

  const handleCreateSubfolder = () => {
    router.push(`/folders/new?parentId=${id}`);
  };

  const handleFolderUpdate = async (updates) => {
    try {
      const res = await fetch(`/api/folders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to update folder");
      }

      toast.success("Folder updated successfully");
      loadFolderData();
    } catch (error) {
      toast.error(error.message || "Failed to update folder");
    }
  };

  const handleDeleteFolder = async () => {
    if (!confirm("Are you sure you want to delete this folder?")) return;

    try {
      const res = await fetch(`/api/folders/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete folder");
      }

      toast.success("Folder deleted successfully");
      router.push("/folders");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete folder");
    }
  };

  const handleArchiveFolder = async () => {
    try {
      const res = await fetch(`/api/folders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: true }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to archive folder");
      }

      toast.success("Folder archived successfully");
      router.push("/folders");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to archive folder");
    }
  };

  const handleNoteDeleted = () => {
    loadFolderData();
  };

  if (loading) {
    return (
      <div className="folder-detail-loading">
        <div className="loader-container">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading folder...</p>
        </div>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="folder-not-found">
        <div className="not-found-content">
          <FolderOpen className="w-16 h-16 text-gray-400" />
          <h2>Folder Not Found</h2>
          <p>The folder you're looking for doesn't exist or has been moved.</p>
          <Link href="/folders" className="back-btn">
            <ArrowLeft className="w-4 h-4" />
            Back to Folders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="folder-detail-page">
      {/* Header */}
      <div className="folder-header">
        <div className="header-content">
          <div className="breadcrumb">
            <Link href="/folders" className="breadcrumb-link">
              Folders
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="breadcrumb-current">{folder.title}</span>
          </div>

          <div className="folder-title-section">
            <div
              className="folder-icon-header"
              style={{ backgroundColor: folder.color }}
            >
              <Folder className="w-6 h-6" />
            </div>
            <div className="title-content">
              <h1>{folder.title}</h1>
              {folder.description && (
                <p className="folder-description-header">{folder.description}</p>
              )}
              <div className="folder-meta-header">
                <span className="meta-item">
                  <FileText className="w-3 h-3" />
                  {stats.totalNotes} notes
                </span>
                <span className="meta-item">
                  <FolderOpen className="w-3 h-3" />
                  {stats.subfoldersCount} subfolders
                </span>
                {folder.isProtected && (
                  <span className="meta-item protected">
                    <Lock className="w-3 h-3" />
                    Protected
                  </span>
                )}
                <span className="meta-item">
                  <Calendar className="w-3 h-3" />
                  Created {new Date(folder.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            onClick={handleCreateNote}
            className="action-btn primary"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
          <button
            onClick={handleCreateSubfolder}
            className="action-btn secondary"
          >
            <Folder className="w-4 h-4" />
            New Subfolder
          </button>
          <FolderActions
            folder={folder}
            onEdit={handleFolderUpdate}
            onArchive={handleArchiveFolder}
            onDelete={handleDeleteFolder}
            onDuplicate={() => router.push(`/folders/${id}/duplicate`)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="folder-main-content">
        {/* Left Sidebar - Folder Info */}
        <div className="folder-sidebar">
          <FolderInfoCard folder={folder} stats={stats} />
          
          <div className="sidebar-section">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn">
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button className="quick-action-btn">
                <Move className="w-4 h-4" />
                Move
              </button>
              <button className="quick-action-btn">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="quick-action-btn">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Folder Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.totalNotes}</div>
                <div className="stat-label">Total Notes</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.archivedNotes}</div>
                <div className="stat-label">Archived</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.subfoldersCount}</div>
                <div className="stat-label">Subfolders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Area - Notes and Subfolders */}
        <div className="folder-content">
          {/* Toolbar */}
          <div className="content-toolbar">
            <div className="toolbar-left">
              <div className="view-toggle">
                <button
                  onClick={() => setNotesView("grid")}
                  className={`view-btn ${notesView === "grid" ? "active" : ""}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setNotesView("list")}
                  className={`view-btn ${notesView === "list" ? "active" : ""}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <div className="search-container">
                <Search className="w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search in folder..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="toolbar-right">
              <button className="toolbar-btn">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="toolbar-btn">
                <Tag className="w-4 h-4" />
                Tags
              </button>
            </div>
          </div>

          {/* Subfolders Section */}
          {subfolders.length > 0 && (
            <div className="subfolders-section">
              <div className="section-header">
                <h2>Subfolders</h2>
                <Link href={`/folders?parentId=${id}`} className="view-all-link">
                  View all
                </Link>
              </div>
              <SubfoldersGrid
                folders={subfolders}
                onFolderClick={(subfolderId) =>
                  router.push(`/folders/${subfolderId}`)
                }
              />
            </div>
          )}

          {/* Notes Section */}
          <div className="notes-section">
            <div className="section-header">
              <h2>Notes in this Folder</h2>
              <div className="section-actions">
                <span className="notes-count">
                  {notes.length} note{notes.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {notes.length > 0 ? (
              <NotesList
                notes={notes}
                view={notesView}
                onNoteDeleted={handleNoteDeleted}
              />
            ) : (
              <div className="empty-notes">
                <FileText className="w-12 h-12 text-gray-400" />
                <h3>No notes yet</h3>
                <p>Create your first note in this folder</p>
                <button
                  onClick={handleCreateNote}
                  className="create-note-btn"
                >
                  <Plus className="w-4 h-4" />
                  Create Note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
