import React from "react";

type Props = {
  title: string;
  content: string;
  updatedAt?: string;
  onClick?: () => void;
};

export default function NoteCard({ title, content, updatedAt, onClick }: Props) {
  return (
    <article onClick={onClick} className="note-card" dir="rtl">
      <div className="note-header-row">
        <h3 className="note-title">{title}</h3>
        {updatedAt && (
          <time className="note-time">{updatedAt}</time>
        )}
      </div>
      <p className="note-content">{content}</p>
    </article>
  );
}
