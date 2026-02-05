"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Folder, Search, Star, Clock, Eye, Tag, TrendingUp, BarChart3, Calendar } from "lucide-react";
import "@/styles/dashboard.css";

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalFolders: 0,
    totalTags: 0,
    starredNotes: 0,
    archivedNotes: 0,
    sharedNotes: 0
  });
  const [recentNotes, setRecentNotes] = useState([]);
  const [recentFolders, setRecentFolders] = useState([]);
  const [topTags, setTopTags] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Load all necessary data
        const [notesRes, foldersRes, tagsRes, reportRes] = await Promise.all([
          fetch('/api/notes?limit=10&sort=-updatedAt'),
          fetch('/api/folders?limit=20'),
          fetch('/api/tags?limit=20&sort=usage_desc'),
          fetch('/api/report')
        ]);

        const notesJson = await notesRes.json();
        const foldersJson = await foldersRes.json();
        const tagsJson = await tagsRes.json();
        const reportJson = await reportRes.json();

        if (!mounted) return;

        const allNotes = notesJson.data || [];
        const allFolders = foldersJson.data || [];
        const allTags = tagsJson.tags || [];
        const report = reportJson.report || {};

        setStats({
          totalNotes: report.totalNotes || notesJson.pagination?.total || 0,
          totalFolders: report.totalFolders || foldersJson.pagination?.total || 0,
          totalTags: allTags.length,
          starredNotes: allNotes.filter(n => n.isStarred).length,
          archivedNotes: allNotes.filter(n => n.status === 'archived').length,
          sharedNotes: allNotes.filter(n => n.isShared).length
        });

        setRecentNotes(allNotes.slice(0, 8).map(n => ({
          id: n._id,
          title: n.title,
          content: n.content,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          views: n.views || 0,
          isStarred: n.isStarred,
          status: n.status
        })));

        setRecentFolders(allFolders.slice(0, 6).map(f => ({
          id: f._id,
          name: f.name,
          noteCount: f.noteCount || 0,
          color: f.color || '#3b82f6'
        })));

        setTopTags(allTags.slice(0, 5).map(t => ({
          name: t.name || t,
          usageCount: t.usageCount || 0
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
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome, {session?.user?.name || 'User'}👋</h1>
          <p className="welcome-subtitle">Your personal note management hub</p>
        </div>
        <div className="welcome-actions">
          <Link href="/dashboard/notes/new" className="primary-btn">
            <Plus size={18} /> New Note
          </Link>
          <Link href="/dashboard/folders/new" className="secondary-btn">
            <Folder size={18} /> New Folder
          </Link>
          <Link href="/dashboard/tags/new" className="secondary-btn">
            <Tag size={18} /> New Tag
          </Link>
          <Link href="/dashboard/search" className="secondary-btn">
            <Search size={18} /> Search
          </Link>
        </div>
      </div>

      {/* Stats Grid - 6 columns */}
      <div className="stats-grid stats-grid-6">
        <div className="stat-card blue" onClick={() => router.push('/dashboard/notes')}>
          <div className="stat-card-icon"><FileText size={24} /></div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.totalNotes}</div>
            <div className="stat-card-label">Total Notes</div>
          </div>
        </div>

        <div className="stat-card purple" onClick={() => router.push('/dashboard/folders')}>
          <div className="stat-card-icon"><Folder size={24} /></div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.totalFolders}</div>
            <div className="stat-card-label">Folders</div>
          </div>
        </div>

        <div className="stat-card orange" onClick={() => router.push('/dashboard/notes?status=starred')}>
          <div className="stat-card-icon"><Star size={24} /></div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.starredNotes}</div>
            <div className="stat-card-label">Starred</div>
          </div>
        </div>

        <div className="stat-card green" onClick={() => router.push('/dashboard/tags')}>
          <div className="stat-card-icon"><Tag size={24} /></div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.totalTags}</div>
            <div className="stat-card-label">Tags</div>
          </div>
        </div>

        <div className="stat-card red" onClick={() => router.push('/dashboard/notes?status=archived')}>
          <div className="stat-card-icon"><Calendar size={24} /></div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.archivedNotes}</div>
            <div className="stat-card-label">Archived</div>
          </div>
        </div>

        <div className="stat-card cyan" onClick={() => router.push('/dashboard/notes')}>
          <div className="stat-card-icon"><TrendingUp size={24} /></div>
          <div className="stat-card-content">
            <div className="stat-card-value">{stats.sharedNotes}</div>
            <div className="stat-card-label">Shared</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Recent Notes Section */}
        <section className="section-card">
          <div className="section-header">
            <h2 className="section-title"><FileText size={20} /> Recent Notes</h2>
            <Link href="/dashboard/notes" className="view-all">View all →</Link>
          </div>
          <div className="notes-list">
            {recentNotes.length === 0 && (
              <div className="empty-state">
                <FileText size={40} />
                <p>No notes yet. Create your first note!</p>
              </div>
            )}
            {recentNotes.map(note => (
              <div
                key={note.id}
                className="note-card clickable"
                onClick={() => router.push(`/dashboard/notes/${note.id}`)}
              >
                <div className="note-header">
                  <h3 className="note-title">{note.title || 'Untitled'}</h3>
                  <div className="note-badges">
                    {note.isStarred && <span className="badge starred"><Star size={12} /></span>}
                    {note.status === 'archived' && <span className="badge archived">Archived</span>}
                  </div>
                </div>
                <p className="note-preview">{note.content ? note.content.substring(0, 80) + '...' : 'No content'}</p>
                <div className="note-meta">
                  <span><Clock size={12} /> {new Date(note.updatedAt).toLocaleDateString()}</span>
                  <span><Eye size={12} /> {note.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          {/* Folders Section */}
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title"><Folder size={18} /> Folders</h3>
              <Link href="/dashboard/folders" className="view-all text-sm">View all →</Link>
            </div>
            <div className="folders-list">
              {recentFolders.length === 0 ? (
                <div className="empty-state-small">
                  <p>No folders yet</p>
                </div>
              ) : (
                recentFolders.map(f => (
                  <div
                    key={f.id}
                    className="folder-item"
                    onClick={() => router.push(`/dashboard/folders/${f.id}`)}
                  >
                    <div className="folder-color" style={{ backgroundColor: f.color }}></div>
                    <div className="folder-info">
                      <div className="folder-name">{f.name}</div>
                      <div className="folder-count">{f.noteCount} notes</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Tags Section */}
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title"><Tag size={18} /> Top Tags</h3>
              <Link href="/dashboard/tags" className="view-all text-sm">View all →</Link>
            </div>
            <div className="tags-list">
              {topTags.length === 0 ? (
                <div className="empty-state-small">
                  <p>No tags yet</p>
                </div>
              ) : (
                topTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="tag-item"
                    onClick={() => router.push(`/dashboard/tags?search=${tag.name}`)}
                  >
                    <span className="tag-name">#{tag.name}</span>
                    <span className="tag-count">{tag.usageCount}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="section-card quick-stats">
            <h3 className="section-title"><BarChart3 size={18} /> Quick Stats</h3>
            <div className="stats-small">
              <div className="stat-item">
                <span className="label">Notes per Folder</span>
                <span className="value">
                  {stats.totalFolders > 0 ? Math.round(stats.totalNotes / stats.totalFolders) : 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="label">Archive Rate</span>
                <span className="value">
                  {stats.totalNotes > 0 ? Math.round((stats.archivedNotes / stats.totalNotes) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}