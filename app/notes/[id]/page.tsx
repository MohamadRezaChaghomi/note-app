"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/notes/${id}`);
        if (!res.ok) {
          console.error("Failed to fetch note:", res.status, res.statusText);
          throw new Error(`Failed to load note: ${res.status}`);
        }
        const data = await res.json();
        setNote(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (e) {
        console.error("Error loading note:", e);
        // Set a placeholder note on error
        setNote({
          _id: id,
          title: "خطا در بارگذاری",
          content: "متأسفانه نتوانستیم یادداشت را بارگذاری کنیم.",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    load();
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error("save failed");
      const updated = await res.json();
      setNote(updated);
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  }

  if (!note) return <div className="p-6">در حال بارگذاری...</div>;

  return (
    <div className="note-page-layout">
      <header className="app-header">
        <div className="navbar-container">
          <div className="navbar-start">
            <Link href="/" className="navbar-logo-link">
              <span className="navbar-logo">📓</span>
            </Link>
          </div>
          <div className="navbar-end">
            <ThemeToggle />
            <button 
              onClick={() => router.back()} 
              className="btn btn-ghost"
            >
              ← بازگشت
            </button>
          </div>
        </div>
      </header>

      <div className="note-page">
        <div className="note-page-inner">
          <div className="fade-in">
            <div className="note-page-row">
              <h2 className="note-title">{note.title}</h2>
              <div className="note-time">{new Date(note.updatedAt || note.createdAt).toLocaleString()}</div>
            </div>

            {!editing ? (
              <div className="note-page-content">
                <div className="note-content"><p>{note.content}</p></div>
                <div className="note-page-actions">
                  <button className="btn-primary" onClick={() => setEditing(true)}>ویرایش</button>
                </div>
              </div>
            ) : (
              <form onSubmit={save} className="space-y-2 note-page-actions">
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea className="input" value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
                <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
                  <button type="submit" className="btn-primary">ذخیره</button>
                  <button type="button" className="btn" onClick={() => setEditing(false)}>انصراف</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
