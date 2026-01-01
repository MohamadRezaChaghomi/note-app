"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Folder, Search, TrendingUp, Clock, Star, Activity } from "lucide-react";
import "@/styles/dashboard.css";

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalFolders: 0,
    starredNotes: 0,
    recentNotes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats from API
        const [notesRes, foldersRes, recentRes] = await Promise.all([
          fetch("/api/notes?limit=1"),
          fetch("/api/folders?limit=1"),
          fetch("/api/notes?limit=3&sort=-createdAt")
        ]);

        const notesData = await notesRes.json();
        const foldersData = await foldersRes.json();
        const recentData = await recentRes.json();

        const starredCount = notesData.data?.filter(n => n.isStarred).length || 0;
        const totalNotes = notesData.pagination?.total || 0;
        const totalFolders = foldersData.pagination?.total || 0;

        setStats({
          totalNotes: totalNotes,
          totalFolders: totalFolders,
          starredNotes: starredCount,
          recentNotes: (recentData.data || []).slice(0, 3).map(note => ({
            id: note._id,
            title: note.title,
            preview: note.content?.substring(0, 60) + "..." || "No content",
            date: new Date(note.createdAt).toLocaleDateString()
          }))
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className={`stat-card-icon ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="stat-card-change positive">
          <span>↑</span>
          <span>12%</span>
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );

  return (
    <div className="dashboard-home">
      {/* Welcome Card */}
      <div className="welcome-card">
        <div className="welcome-card-content">
          <div className="welcome-card-title">
            Welcome back, {session?.user?.name?.split(" ")[0] || "there"}! 👋
          </div>
          <div className="welcome-card-subtitle">
            Organize your thoughts and stay productive with Web Notes
          </div>
          <Link href="/dashboard/notes/new" className="welcome-card-cta">
            <Plus className="w-4 h-4" />
            Create New Note
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard icon={FileText} label="Total Notes" value={stats.totalNotes} color="blue" />
        <StatCard icon={Folder} label="Folders" value={stats.totalFolders} color="purple" />
        <StatCard icon={Star} label="Starred" value={stats.starredNotes} color="orange" />
        <StatCard icon={Activity} label="This Month" value="42" color="green" />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link href="/dashboard/notes/new" className="action-btn">
          <div className="action-btn-icon">
            <Plus className="w-6 h-6" />
          </div>
          <div className="action-btn-text">New Note</div>
        </Link>
        <Link href="/dashboard/notes" className="action-btn">
          <div className="action-btn-icon">
            <FileText className="w-6 h-6" />
          </div>
          <div className="action-btn-text">All Notes</div>
        </Link>
        <Link href="/dashboard/search" className="action-btn">
          <div className="action-btn-icon">
            <Search className="w-6 h-6" />
          </div>
          <div className="action-btn-text">Search</div>
        </Link>
        <Link href="/dashboard/notes?filter=starred" className="action-btn">
          <div className="action-btn-icon">
            <Star className="w-6 h-6" />
          </div>
          <div className="action-btn-text">Starred</div>
        </Link>
      </div>

      {/* Recent Notes Section */}
      <div className="activity-section">
        <div className="activity-section-title">Recent Notes</div>
        {stats.recentNotes.length > 0 ? (
          <div className="recent-notes-list">
            {stats.recentNotes.map((note) => (
              <div key={note.id} className="note-item" onClick={() => router.push(`/dashboard/notes/${note.id}`)}>
                <div className="note-icon">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="note-content">
                  <div className="note-title">{note.title}</div>
                  <div className="note-preview">{note.preview}</div>
                  <div className="note-meta">
                    <div>
                      <Clock className="w-3 h-3 inline mr-1" />
                      {note.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <div className="empty-state-title">No Notes Yet</div>
            <div className="empty-state-text">Start creating your first note to get organized</div>
            <Link href="/dashboard/notes/new" className="welcome-card-cta">
              <Plus className="w-4 h-4" />
              Create First Note
            </Link>
          </div>
        )}
      </div>

      {/* Productivity Tips */}
      <div className="activity-section">
        <div className="activity-section-title">💡 Productivity Tips</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          <div style={{ padding: "1rem", background: "var(--bg-light)", borderRadius: "0.75rem" }}>
            <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Use Tags</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Organize notes with tags for better discovery</div>
          </div>
          <div style={{ padding: "1rem", background: "var(--bg-light)", borderRadius: "0.75rem" }}>
            <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Create Folders</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Group related notes in folders for structure</div>
          </div>
          <div style={{ padding: "1rem", background: "var(--bg-light)", borderRadius: "0.75rem" }}>
            <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Star Important</div>
            <div style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Mark key notes as starred for quick access</div>
          </div>
        </div>
      </div>
    </div>
  );
}
