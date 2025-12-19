"use client";

import React, { useState } from "react";
import Modal from "./Modal";

export default function AddNoteModal({ open, onClose, onCreate, defaultFolder }: { open: boolean; onClose: () => void; onCreate: (note: any) => void; defaultFolder?: string; }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, folder: defaultFolder }),
      });
      const data = await res.json();
      onCreate(data);
      setTitle('');
      setContent('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="ایجاد یادداشت">
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="عنوان" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="متن" />
        <div className="flex justify-end">
          <button type="submit" disabled={loading || !title} className="px-4 py-2 bg-blue-500 text-white rounded">{loading ? 'در حال ارسال...' : 'ذخیره'}</button>
        </div>
      </form>
    </Modal>
  );
}
