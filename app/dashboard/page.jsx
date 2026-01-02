"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  FileText,
  Folder,
  Search,
  TrendingUp,
  Clock,
  Star,
  Activity,
  Users,
  Calendar,
  BarChart3,
  ArrowUpRight,
  Eye,
  Edit,
  Trash2,
  Download
} from "lucide-react";
import "@/styles/dashboard.css";

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalNotes: 0,
      totalFolders: 0,
      starredNotes: 0,
      notesThisMonth: 0,
      totalViews: 0,
      sharedNotes: 0
    },
    recentNotes: [],
    popularNotes: [],
    folders: [],
    activityLog: [],
    loading: true
  });
  const [quickStats, setQuickStats] = useState([
    { label: "Daily Active", value: "0", change: "+0%", icon: Activity, color: "blue" },
    { label: "Storage Used", value: "0 MB", change: "+0%", icon: TrendingUp, color: "purple" },
    { label: "Team Members", value: "0", change: "+0%", icon: Users, color: "green" },
    { label: "Tasks Due", value: "0", change: "+0%", icon: Calendar, color: "orange" }
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true }));
        
        // Fetch all data in parallel
        const [
          notesRes,
          foldersRes,
          recentRes,
          popularRes,
          activityRes,
          statsRes
        ] = await Promise.all([
          fetch("/api/notes?limit=100"),
          fetch("/api/folders?limit=50"),
          fetch("/api/notes?limit=5&sort=-createdAt"),
          fetch("/api/notes?limit=5&sort=-views"),
          fetch("/api/activity?limit=10"),
          fetch("/api/dashboard/stats")
        ]);

        const notesData = await notesRes.json();
        const foldersData = await foldersRes.json();
        const recentData = await recentRes.json();
        const popularData = await popularRes.json();
        const activityData = await activityRes.json();
        const statsData = await statsRes.json();

        // Calculate statistics
        const totalNotes = notesData.pagination?.total || 0;
        const totalFolders = foldersData.pagination?.total || 0;
        const starredNotes = notesData.data?.filter(n => n.isStarred).length || 0;
        const notesThisMonth = notesData.data?.filter(n => {
          const noteDate = new Date(n.createdAt);
          const now = new Date();
          return noteDate.getMonth() === now.getMonth() && 
                 noteDate.getFullYear() === now.getFullYear();
        }).length || 0;

        const totalViews = notesData.data?.reduce((sum, note) => sum + (note.views || 0), 0) || 0;
        const sharedNotes = notesData.data?.filter(n => n.sharedWith && n.sharedWith.length > 0).length || 0;

        setDashboardData({
          stats: {
            totalNotes,
            totalFolders,
            starredNotes,
            notesThisMonth,
            totalViews,
            sharedNotes
          },
          recentNotes: (recentData.data || []).slice(0, 5).map(note => ({
            id: note._id,
            title: note.title,
            content: note.content,
            tags: note.tags || [],
            createdAt: note.createdAt,
            isStarred: note.isStarred,
            views: note.views || 0,
            folder: note.folder
          })),
          popularNotes: (popularData.data || []).slice(0, 5).map(note => ({
            id: note._id,
            title: note.title,
            views: note.views || 0,
            isStarred: note.isStarred,
            createdAt: note.createdAt
          })),
          folders: (foldersData.data || []).slice(0, 4).map(folder => ({
            id: folder._id,
            name: folder.name,
            noteCount: folder.noteCount || 0,
            color: folder.color || "var(--color-primary-500)"
          })),
          activityLog: (activityData.data || []).slice(0, 8).map(activity => ({
            id: activity._id,
            type: activity.type,
            description: activity.description,
            timestamp: activity.createdAt,
            user: activity.user
          })),
          loading: false
        });

        // Update quick stats from API stats if available
        if (statsData) {
          setQuickStats([
            { label: "Daily Active", value: statsData.dailyActive || "0", change: "+12%", icon: Activity, color: "blue" },
            { label: "Storage Used", value: `${statsData.storageUsed || 0} MB`, change: "+5%", icon: TrendingUp, color: "purple" },
            { label: "Team Members", value: statsData.teamMembers || "0", change: "+8%", icon: Users, color: "green" },
            { label: "Tasks Due", value: statsData.tasksDue || "0", change: "+3%", icon: Calendar, color: "orange" }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <div className={`stat-card ${color}`} onClick={onClick}>
      <div className="stat-card-header">
        <div className="stat-card-icon-wrapper">
          <Icon className="stat-card-icon" size={24} />
        </div>
        <div className="stat-card-trend">
          <ArrowUpRight size={16} />
          <span>+12%</span>
        </div>
      </div>
      <div className="stat-card-content">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );

  const FolderCard = ({ folder }) => (
    <div 
      className="folder-card" 
      onClick={() => router.push(`/dashboard/folders/${folder.id}`)}
      style={{ borderLeftColor: folder.color }}
    >
      <div className="folder-icon">
        <Folder size={20} />
      </div>
      <div className="folder-content">
        <div className="folder-name">{folder.name}</div>
        <div className="folder-count">{folder.noteCount} notes</div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="activity-item">
      <div className="activity-icon">
        {activity.type === 'create' && '📝'}
        {activity.type === 'update' && '✏️'}
        {activity.type === 'delete' && '🗑️'}
        {activity.type === 'share' && '👥'}
        {activity.type === 'star' && '⭐'}
      </div>
      <div className="activity-content">
        <div className="activity-text">{activity.description}</div>
        <div className="activity-time">
          {new Date(activity.timestamp).toLocaleDateString()} • 
          {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );

  if (dashboardData.loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Good morning, {session?.user?.name?.split(" ")[0] || "there"}! 🌅
          </h1>
          <p className="welcome-subtitle">
            Here's what's happening with your notes today.
          </p>
        </div>
        <div className="welcome-actions">
          <Link href="/dashboard/notes/new" className="primary-btn">
            <Plus size={20} />
            New Note
          </Link>
          <button className="secondary-btn" onClick={() => router.push("/dashboard/import")}>
            <Download size={20} />
            Import
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          icon={FileText} 
          label="Total Notes" 
          value={dashboardData.stats.totalNotes.toLocaleString()} 
          color="blue"
          onClick={() => router.push("/dashboard/notes")}
        />
        <StatCard 
          icon={Folder} 
          label="Folders" 
          value={dashboardData.stats.totalFolders.toLocaleString()} 
          color="purple"
          onClick={() => router.push("/dashboard/folders")}
        />
        <StatCard 
          icon={Star} 
          label="Starred" 
          value={dashboardData.stats.starredNotes.toLocaleString()} 
          color="orange"
          onClick={() => router.push("/dashboard/notes?filter=starred")}
        />
        <StatCard 
          icon={Activity} 
          label="This Month" 
          value={dashboardData.stats.notesThisMonth.toLocaleString()} 
          color="green"
          onClick={() => router.push("/dashboard/notes?filter=this-month")}
        />
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <h2 className="section-title">Quick Stats</h2>
        <div className="quick-stats-grid">
          {quickStats.map((stat, index) => (
            <div key={index} className="quick-stat-item">
              <div className="quick-stat-icon" style={{ background: `var(--color-${stat.color}-100)` }}>
                <stat.icon size={20} style={{ color: `var(--color-${stat.color}-600)` }} />
              </div>
              <div className="quick-stat-content">
                <div className="quick-stat-value">{stat.value}</div>
                <div className="quick-stat-label">{stat.label}</div>
              </div>
              <div className="quick-stat-change positive">
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notes & Popular Notes Side by Side */}
      <div className="notes-grid">
        {/* Recent Notes */}
        <div className="notes-section">
          <div className="section-header">
            <h2 className="section-title">Recent Notes</h2>
            <Link href="/dashboard/notes" className="view-all">
              View all
            </Link>
          </div>
          <div className="notes-list">
            {dashboardData.recentNotes.map((note) => (
              <div 
                key={note.id} 
                className="note-card"
                onClick={() => router.push(`/dashboard/notes/${note.id}`)}
              >
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  {note.isStarred && <Star size={16} className="star-icon" />}
                </div>
                <div className="note-preview">
                  {note.content?.substring(0, 100)}...
                </div>
                <div className="note-footer">
                  <div className="note-tags">
                    {note.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="note-tag">#{tag}</span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="note-tag-more">+{note.tags.length - 2}</span>
                    )}
                  </div>
                  <div className="note-meta">
                    <Clock size={14} />
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    <Eye size={14} />
                    <span>{note.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Notes */}
        <div className="notes-section">
          <div className="section-header">
            <h2 className="section-title">Popular Notes</h2>
            <Link href="/dashboard/notes?sort=views" className="view-all">
              View all
            </Link>
          </div>
          <div className="popular-notes">
            {dashboardData.popularNotes.map((note, index) => (
              <div 
                key={note.id} 
                className="popular-note-item"
                onClick={() => router.push(`/dashboard/notes/${note.id}`)}
              >
                <div className="popular-note-rank">{index + 1}</div>
                <div className="popular-note-content">
                  <div className="popular-note-title">{note.title}</div>
                  <div className="popular-note-meta">
                    <span>{note.views} views</span>
                    <span>•</span>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {note.isStarred && <Star size={16} className="star-icon" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Folders & Activity Side by Side */}
      <div className="bottom-grid">
        {/* Folders */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Folders</h2>
            <Link href="/dashboard/folders" className="view-all">
              View all
            </Link>
          </div>
          <div className="folders-grid">
            {dashboardData.folders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
          {dashboardData.folders.length === 0 && (
            <div className="empty-state">
              <Folder size={48} />
              <p>No folders yet</p>
              <Link href="/dashboard/folders/new" className="create-btn">
                Create Folder
              </Link>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <Link href="/dashboard/activity" className="view-all">
              View all
            </Link>
          </div>
          <div className="activity-list">
            {dashboardData.activityLog.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
          {dashboardData.activityLog.length === 0 && (
            <div className="empty-state">
              <Activity size={48} />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="quick-action" onClick={() => router.push("/dashboard/notes/new")}>
            <div className="quick-action-icon blue">
              <Plus size={24} />
            </div>
            <div className="quick-action-label">New Note</div>
          </button>
          <button className="quick-action" onClick={() => router.push("/dashboard/search")}>
            <div className="quick-action-icon purple">
              <Search size={24} />
            </div>
            <div className="quick-action-label">Search</div>
          </button>
          <button className="quick-action" onClick={() => router.push("/dashboard/import")}>
            <div className="quick-action-icon green">
              <Download size={24} />
            </div>
            <div className="quick-action-label">Import</div>
          </button>
          <button className="quick-action" onClick={() => router.push("/dashboard/export")}>
            <div className="quick-action-icon orange">
              <BarChart3 size={24} />
            </div>
            <div className="quick-action-label">Export</div>
          </button>
        </div>
      </div>
    </div>
  );
}