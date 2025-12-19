"use client";

import React, { useState } from "react";
import Modal from "./Modal";

export default function FolderModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (name: string) => void; }) {
  const [name, setName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim());
    setName("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="افزودن فولدر">
      <form onSubmit={submit} className="modal-form">
        <div className="modal-form-group">
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="input" 
            placeholder="نام فولدر"
            autoFocus
          />
        </div>
        <div className="modal-footer-inner">
          <button type="submit" className="btn-primary">ایجاد</button>
        </div>
      </form>
    </Modal>
  );
}

