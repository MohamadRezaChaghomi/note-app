"use client";

import NoteCard from "./NoteCard";
import "@/styles/components/notes.css";
export default function NoteList({
  notes,
  selectedNotes = [],
  bulkMode = false,
  onSelectNote,
  onNoteAction,
  onViewNote
}) {
  return (
    <div className="notes-list">
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          selected={selectedNotes.includes(note._id)}
          bulkMode={bulkMode}
          compact={true}
          onSelect={onSelectNote}
          onAction={onNoteAction}
          onView={onViewNote}
        />
      ))}
    </div>
  );
}