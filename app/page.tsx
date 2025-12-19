"use client";

import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Folder from "../components/Folder";
import FolderModal from "../components/FolderModal";
import AuthModal from "../components/AuthModal";
import AddNoteModal from "../components/AddNoteModal";
import NoteModal from "../components/NoteModal";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);
  const [query, setQuery] = useState("");
  const [customFolders, setCustomFolders] = useState<string[]>([]);

  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [openAddNoteModal, setOpenAddNoteModal] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [activeNote, setActiveNote] = useState<any | null>(null);

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
    function onOpenAuth(e: Event) {
      const detail = (e as CustomEvent).detail as any;
      setAuthMode(detail?.mode === 'register' ? 'register' : 'login');
      setOpenAuthModal(true);
    }

    function onOpenAddNote() {
      setOpenAddNoteModal(true);
    }

    window.addEventListener('open-auth', onOpenAuth as EventListener);
    window.addEventListener('open-add-note', onOpenAddNote as EventListener);

    return () => {
      window.removeEventListener('open-auth', onOpenAuth as EventListener);
      window.removeEventListener('open-add-note', onOpenAddNote as EventListener);
    };
  }, []);

  return (
    <main className="min-h-screen flex items-start justify-center bg-gray-50 dark:bg-black p-6">
      <div className="w-full max-w-[1100px] rounded-2xl shadow-lg overflow-hidden bg-transparent flex gap-6" dir="rtl">
        <div className="w-1/3">
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
            className="h-[640px]"
          />
        </div>

        <div className="flex-1 bg-white dark:bg-[#070707] rounded-xl overflow-hidden">
          <Navbar onSearch={(q) => setQuery(q)} />

          <div className="p-4 h-[580px] overflow-auto">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">{selectedFolder || "همه"}</h2>
            </div>

            <div className="space-y-3">
              {filteredNotes.map((n) => (
                <div key={n._id} onClick={() => { setActiveNote(n); setOpenNoteModal(true); }}>
                  <Folder name={n.folder || "quick"} notes={[{ id: n._id, title: n.title, content: n.content }]} />
                </div>
              ))}

              {filteredNotes.length === 0 && (
                <div className="text-sm text-gray-500">یادداشتی برای این فولدر وجود ندارد.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FolderModal open={openFolderModal} onClose={() => setOpenFolderModal(false)} onCreate={(name) => setCustomFolders((s) => [...s, name])} />
      <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} mode={authMode} />
      <AddNoteModal open={openAddNoteModal} onClose={() => setOpenAddNoteModal(false)} defaultFolder={selectedFolder === 'همه' ? 'quick' : selectedFolder} onCreate={(note) => setNotes((s) => [note, ...s])} />
      <NoteModal open={openNoteModal} onClose={() => setOpenNoteModal(false)} note={activeNote ? { title: activeNote.title, content: activeNote.content } : null} />
    </main>
  );
}
