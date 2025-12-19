"use client";

import React from "react";
import Modal from "./Modal";

export default function NoteModal({ open, onClose, note }: { open: boolean; onClose: () => void; note?: { title: string; content: string } | null; }) {
  if (!note) return null;
  return (
    <Modal open={open} onClose={onClose} title={note.title}>
      <div className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{note.content}</div>
    </Modal>
  );
}
