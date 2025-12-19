"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Folder from "../components/Folder";
import FolderModal from "../components/FolderModal";
import AddNoteModal from "../components/AddNoteModal";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [customFolders, setCustomFolders] = useState<string[]>([]);

  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openAddNoteModal, setOpenAddNoteModal] = useState(false);

  // mock notes for preview (will be replaced by real API when logged in)
  useEffect(() => {
    const mock = [
      { _id: "1", title: "خلاصه جلسه", content: "نکات مهم جلسه امروز...", folder: "درس‌ها" },
      { _id: "2", title: "تمرین الگوریتم", content: "پیاده‌سازی مرتب‌سازی...", folder: "درس‌ها" },
      { _id: "3", title: "ایده اپ", content: "طرح اولیه رابط کاربری...", folder: "پروژه‌ها" },
      { _id: "4", title: "یادداشت سریع", content: "خرید کتاب", folder: "quick" },
    ];

    setNotes(mock);
    setSelectedFolder("همه");
  }, []);

  const folders = useMemo(() => {
    const map = new Map<string, number>();
    map.set("همه", notes.length);
    for (const n of notes) {
      const f = n.folder || "quick";
      map.set(f, (map.get(f) || 0) + 1);
    }
    // include custom folders (created by user)
    for (const cf of customFolders) {
      if (!map.has(cf)) map.set(cf, 0);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ id: name, name, count }));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (selectedFolder && selectedFolder !== "همه" && n.folder !== selectedFolder) return false;
      if (query && !(n.title + n.content).includes(query)) return false;
      return true;
    });
  }, [notes, selectedFolder, query]);

  useEffect(() => {
    function onOpenAddNote() {
      setOpenAddNoteModal(true);
    }

    window.addEventListener('open-add-note', onOpenAddNote as EventListener);

    return () => {
      window.removeEventListener('open-add-note', onOpenAddNote as EventListener);
    };
  }, []);

  return (
    <main className="app-layout">
      <div className="layout-inner" dir="rtl">
        <Sidebar
          folders={folders}
          selected={selectedFolder}
          onSelect={(id) => {
            if (id === "__add_folder__") {
              setOpenFolderModal(true);
            } else {
              setSelectedFolder(id);
            }
          }}
          className=""
        />

        <div className="content-panel">
          <Navbar onSearch={(q) => setQuery(q)} />

          <div className="content-body">
            <div style={{ marginBottom: 12 }}>
              <h2 className="note-title">{selectedFolder || "همه"}</h2>
            </div>

            <div className="notes-grid">
              {filteredNotes.map((n) => (
                <div key={n._id} onClick={() => { window.location.href = `/notes/${n._id}` }}>
                  <Folder name={n.folder || "quick"} notes={[{ id: n._id, title: n.title, content: n.content }]} />
                </div>
              ))}

              {filteredNotes.length === 0 && (
                <div className="note-content">یادداشتی برای این فولدر وجود ندارد.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FolderModal open={openFolderModal} onClose={() => setOpenFolderModal(false)} onCreate={(name) => setCustomFolders((s) => [...s, name])} />
      <AddNoteModal open={openAddNoteModal} onClose={() => setOpenAddNoteModal(false)} defaultFolder={selectedFolder === 'همه' ? 'quick' : selectedFolder} onCreate={(note) => setNotes((s) => [note, ...s])} />
    </main>
  );
}
