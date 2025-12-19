import React from "react";
import NoteCard from "./NoteCard";

type Props = {
  name: string;
  notes?: { id: string; title: string; content: string }[];
};

export default function Folder({ name, notes = [] }: Props) {
  return (
    <section className="space-y-3">
      <h3 className="text-md font-semibold">{name}</h3>
      <div className="space-y-2">
        {notes.map((n) => (
          <NoteCard key={n.id} title={n.title} content={n.content} />
        ))}
      </div>
    </section>
  );
}
