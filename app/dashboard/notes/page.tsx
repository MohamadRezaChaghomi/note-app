"use client";

import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import NoteCard from "../../../components/NoteCard";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => setNotes(data || []))
      .catch(() => setNotes([]));
  }, []);

  async function createNote(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const n = await res.json();
      setNotes((s) => [n, ...s]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black p-4">
      <div className="w-[360px] h-[780px] bg-[transparent] rounded-3xl shadow-2xl overflow-hidden">
        <div className="h-full bg-gray-50 dark:bg-[#0b0b0b] flex flex-col">
          <Header />

          <main className="p-4 space-y-4 flex-1 overflow-auto">
            <form onSubmit={createNote} className="space-y-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان"
                label="عنوان"
              />
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="متن یادداشت"
                label="متن"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={loading || !title}>
                  {loading ? "در حال ارسال..." : "ذخیره"}
                </Button>
              </div>
            </form>

            <section className="space-y-3">
              {notes.length === 0 && (
                <p className="text-sm text-gray-500">هیچ یادداشتی موجود نیست.</p>
              )}
              {notes.map((n) => (
                <NoteCard
                  key={n._id}
                  title={n.title}
                  content={n.content}
                  updatedAt={n.createdAt}
                />
              ))}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
