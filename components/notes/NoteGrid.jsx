"use client";

import NoteCard from "./NoteCard";
import "@/styles/components/notes.css";
export default function NoteGrid({
  notes,
  selectedNotes = [],
  bulkMode = false,
  onSelectNote,
  onNoteAction,
  onViewNote
}) {
  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          selected={selectedNotes.includes(note._id)}
          bulkMode={bulkMode}
          onSelect={onSelectNote}
          onAction={onNoteAction}
          onView={onViewNote}
        />
      ))}
    </div>
  );
}
