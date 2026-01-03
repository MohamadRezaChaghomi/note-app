"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Folder, Search, Star, Clock, Eye } from "lucide-react";
import "@/styles/dashboard.css";

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalNotes: 0, totalFolders: 0, starredNotes: 0 });
  const [recentNotes, setRecentNotes] = useState([]);
  const [recentFolders, setRecentFolders] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [notesRes, foldersRes, recentNotesRes] = await Promise.all([
          fetch('/api/notes?limit=100'),
          fetch('/api/folders?limit=20'),
          fetch('/api/notes?limit=5&sort=-createdAt')
        ]);

        const notesJson = await notesRes.json();
        const foldersJson = await foldersRes.json();
        const recentJson = await recentNotesRes.json();

        const allNotes = notesJson.data || [];
        const allFolders = foldersJson.data || [];

        if (!mounted) return;

        setStats({
          totalNotes: notesJson.pagination?.total || allNotes.length,
          totalFolders: foldersJson.pagination?.total || allFolders.length,
          starredNotes: allNotes.filter(n => n.isStarred).length
        });

        setRecentNotes((recentJson.data || []).map(n => ({
          id: n._id,
          title: n.title,
          content: n.content,
          createdAt: n.createdAt,
          views: n.views || 0,
          isStarred: n.isStarred
        })));

        setRecentFolders(allFolders.slice(0, 6).map(f => ({
          id: f._id,
          name: f.name,
          noteCount: f.noteCount || 0,
          color: f.color || 'var(--color-primary-500)'
        })));
      } catch (err) {
        console.error('Dashboard load failed', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"><div className="spinner" /></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome, {session?.user?.name || 'User'}</h1>
          <p className="welcome-subtitle">Quick access to your notes and folders.</p>
        </div>
        <div className="welcome-actions">
          <Link href="/dashboard/notes/new" className="primary-btn">
            <Plus size={18} /> New Note
          </Link>
          <Link href="/dashboard/search" className="secondary-btn">
            <Search size={18} /> Search
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue" onClick={() => router.push('/dashboard/notes')}>
          <div className="stat-card-content">
            <FileText size={20} />
            <div>
              <div className="stat-card-value">{stats.totalNotes}</div>
              <div className="stat-card-label">Notes</div>
            </div>
          </div>
        </div>

        <div className="stat-card purple" onClick={() => router.push('/dashboard/folders')}>
          <div className="stat-card-content">
            <Folder size={20} />
            <div>
              <div className="stat-card-value">{stats.totalFolders}</div>
              <div className="stat-card-label">Folders</div>
            </div>
          </div>
        </div>

        <div className="stat-card orange" onClick={() => router.push('/dashboard/notes?filter=starred')}>
          <div className="stat-card-content">
            <Star size={20} />
            <div>
              <div className="stat-card-value">{stats.starredNotes}</div>
              <div className="stat-card-label">Starred</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <section className="section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Notes</h2>
            <Link href="/dashboard/notes" className="view-all">View all</Link>
          </div>
          <div className="notes-list">
            {recentNotes.length === 0 && <div className="empty-state"><p>No recent notes</p></div>}
            {recentNotes.map(note => (
              <div key={note.id} className="note-card" onClick={() => router.push(`/dashboard/notes/${note.id}`)}>
                <div className="note-header">
                  <h3 className="note-title">{note.title || 'Untitled'}</h3>
                  {note.isStarred && <Star size={14} className="star-icon" />}
                </div>
                <div className="note-preview">{note.content ? note.content.substring(0, 120) : ''}</div>
                <div className="note-meta"><Clock size={12} /> <span>{new Date(note.createdAt).toLocaleDateString()}</span> <Eye size={12} /> <span>{note.views}</span></div>
              </div>
            ))}
          </div>
        </section>

        <aside className="section-card folders-card">
          <div className="section-header">
            <h2 className="section-title">Folders</h2>
            <Link href="/dashboard/folders" className="view-all">View all</Link>
          </div>
          <div className="folders-grid">
            {recentFolders.length === 0 && <div className="empty-state"><p>No folders yet</p></div>}
            {recentFolders.map(f => (
              <div key={f.id} className="folder-card" onClick={() => router.push(`/dashboard/folders/${f.id}`)} style={{ borderLeftColor: f.color }}>
                <div className="folder-name">{f.name}</div>
                <div className="folder-count">{f.noteCount} notes</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}