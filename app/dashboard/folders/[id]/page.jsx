"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Loader2, FileText, AlertCircle } from "lucide-react";
import NoteCard from "@/components/notes/NoteCard";
import "@/styles/notes-page.css";

export default function FolderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const folderId = params.id;

  const [folder, setFolder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!folderId) return;
    loadFolder();
  }, [folderId]);

  const loadFolder = async () => {
    try {
      setLoading(true);
      const [folderRes, notesRes] = await Promise.all([
        fetch(`/api/folders/${folderId}`),
        fetch(`/api/notes?folderId=${folderId}`)
      ]);

      if (!folderRes.ok) throw new Error("Folder not found");
      const folderData = await folderRes.json();
      setFolder(folderData.folder);

      if (notesRes.ok) {
        const notesData = await notesRes.json();
        setNotes(notesData.notes || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteAction = async (noteId, action) => {
    try {
      let body = {};
      if (action === 'star') body.isStarred = true;
      if (action === 'unstar') body.isStarred = false;
      if (action === 'archive') body.isArchived = true;
      if (action === 'unarchive') body.isArchived = false;

      const method = action === 'delete' || action === 'trash' ? 'DELETE' : 'PATCH';
      const url = action === 'delete' || action === 'trash' 
        ? `/api/notes/${noteId}?mode=${action === 'trash' ? 'trash' : 'hard'}`
        : `/api/notes/${noteId}`;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        ...(method === 'PATCH' && { body: JSON.stringify(body) })
      });

      loadFolder();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="folder-detail-page">
        <div className="loading-state">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Loading folder...</p>
        </div>
      </div>
    );
  }

  if (error || !folder) {
    return (
      <div className="folder-detail-page">
        <button onClick={() => router.back()} className="back-button">
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <div className="error-state">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3>Folder Not Found</h3>
          <p>{error || "The requested folder could not be found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="folder-detail-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-back">
          <button onClick={() => router.back()} className="back-button">
            <ChevronLeft className="w-5 h-5" />
            Back to Folders
          </button>
        </div>
        <div className="header-title">
          <h1>{folder.title}</h1>
          {folder.description && <p>{folder.description}</p>}
          <span className="note-count">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Notes List */}
      <div className="folder-notes">
        {notes.length === 0 ? (
          <div className="empty-state">
            <FileText className="w-12 h-12 text-gray-300" />
            <h3>No notes in this folder</h3>
            <p>Create a note and assign it to this folder</p>
            <button onClick={() => router.push('/dashboard/notes/new')} className="btn btn-primary">
              Create Note
            </button>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onView={(n) => router.push(`/dashboard/notes/${n._id}`)}
                onAction={handleNoteAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
