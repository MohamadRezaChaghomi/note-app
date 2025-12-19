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
      <form onSubmit={submit} className="modal-form">
        <div className="modal-form-group">
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="input" 
            placeholder="عنوان"
            autoFocus
          />
        </div>
        <div className="modal-form-group">
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="input" 
            placeholder="متن یادداشت"
            rows={6}
          />
        </div>
        <div className="modal-footer-inner">
          <button type="submit" disabled={loading || !title} className="btn-primary">
            {loading ? 'در حال ارسال...' : 'ذخیره'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

