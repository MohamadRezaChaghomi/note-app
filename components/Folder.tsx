import React from "react";
import NoteCard from "./NoteCard";

type Props = {
  name: string;
  notes?: { id: string; title: string; content: string }[];
};

export default function Folder({ name, notes = [] }: Props) {
  return (
    <section className="folder-section">
      <h3 className="folder-title">{name}</h3>
      <div className="folder-list">
        {notes.map((n) => (
          <NoteCard key={n.id} title={n.title} content={n.content} />
        ))}
      </div>
    </section>
  );
}
