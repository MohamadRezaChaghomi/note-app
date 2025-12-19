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
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="نام فولدر" />
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">ایجاد</button>
        </div>
      </form>
    </Modal>
  );
}
