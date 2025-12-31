"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  TrendingUp, Users, FileText, Tag, Clock, Calendar,
  Star, Eye, Download, Activity, Award, Zap,
  ChevronRight, Loader2, AlertCircle, Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import RecentNotes from "@/components/dashboard/RecentNotes";
import QuickActions from "@/components/dashboard/QuickActions";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import "@/styles/dashboard-home.css";

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [stats, setStats] = useState(null);
  const [recentNotes, setRecentNotes] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("صبح بخیر");
    else if (hour < 18) setGreeting("ظهر بخیر");
    else setGreeting("عصر بخیر");

    loadDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load dashboard stats
      const [statsRes, notesRes, activityRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/notes?limit=4&sort=updatedAt_desc"),
        fetch("/api/activity/recent?limit=6")
      ]);
      
      if (!statsRes.ok || !notesRes.ok) {
        throw new Error("Failed to load dashboard data");
      }
      
      const statsData = await statsRes.json();
      const notesData = await notesRes.json();
      const activityData = await activityRes.json();
      
      setStats(statsData);
      setRecentNotes(notesData.notes || []);
      setActivityData(activityData.activities || []);
      
    } catch (err) {
      setError(err.message);
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Notes",
      value: stats?.totalNotes || 0,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      change: stats?.notesChange || 0,
      href: "/dashboard/notes"
    },
    {
      title: "Starred Notes",
      value: stats?.starredNotes || 0,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      change: stats?.starredChange || 0,
      href: "/dashboard/notes?filter=starred"
    },
    {
      title: "This Week",
      value: stats?.weeklyActivity || 0,
      icon: Activity,
      color: "from-green-500 to-emerald-500",
      change: stats?.activityChange || 0,
      href: "/report"
    },
    {
      title: "Tags Used",
      value: stats?.totalTags || 0,
      icon: Tag,
      color: "from-purple-500 to-pink-500",
      change: stats?.tagsChange || 0,
      href: "/dashboard/notes"
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <p className="loading-text">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-home">
        <div className="error-state">
          <div className="error-icon">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="error-title">Failed to load dashboard</h3>
          <p className="error-message">{error}</p>
          <button
            onClick={loadDashboardData}
            className="retry-btn"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <WelcomeCard 
        user={session?.user}
        greeting={greeting}
        stats={stats}
      />

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={stat.change}
            href={stat.href}
            delay={index * 100}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Left Column - Recent Activity */}
        <div className="left-column">
          {/* Activity Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">
                <Activity className="w-5 h-5" />
                <h3>Activity Overview</h3>
              </div>
              <select className="chart-select">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <ActivityChart data={activityData} />
          </div>

          {/* Recent Notes */}
          <div className="recent-notes-card">
            <div className="card-header">
              <div className="card-title">
                <Clock className="w-5 h-5" />
                <h3>Recent Notes</h3>
              </div>
              <Link href="/dashboard/notes" className="view-all">
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <RecentNotes notes={recentNotes} />
          </div>
        </div>

        {/* Right Column - Quick Actions & Insights */}
        <div className="right-column">
          {/* Quick Actions */}
          <div className="actions-card">
            <div className="card-header">
              <div className="card-title">
                <Zap className="w-5 h-5" />
                <h3>Quick Actions</h3>
              </div>
            </div>
            <QuickActions />
          </div>

          {/* Productivity Stats */}
          <div className="productivity-card">
            <div className="card-header">
              <div className="card-title">
                <TrendingUp className="w-5 h-5" />
                <h3>Productivity</h3>
              </div>
            </div>
            <div className="productivity-stats">
              <div className="stat-item">
                <div className="stat-value">
                  {stats?.avgNotesPerDay || 0}
                </div>
                <div className="stat-label">Avg notes per day</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {stats?.consistency || 0}%
                </div>
                <div className="stat-label">Consistency</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">
                  {stats?.streak || 0}
                </div>
                <div className="stat-label">Day streak</div>
              </div>
            </div>
          </div>

          {/* Upcoming Features */}
          <div className="features-card">
            <div className="card-header">
              <div className="card-title">
                <Sparkles className="w-5 h-5" />
                <h3>What's New</h3>
              </div>
            </div>
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon new">
                  <span>NEW</span>
                </div>
                <div className="feature-content">
                  <h4>Export to PDF</h4>
                  <p>Export your notes as PDF documents</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon soon">
                  <span>SOON</span>
                </div>
                <div className="feature-content">
                  <h4>Voice Notes</h4>
                  <p>Record and transcribe voice notes</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon beta">
                  <span>BETA</span>
                </div>
                <div className="feature-content">
                  <h4>AI Assistant</h4>
                  <p>Get AI-powered writing suggestions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Achievements */}
      <div className="achievements-section">
        <div className="section-header">
          <Award className="w-6 h-6" />
          <h2>Your Achievements</h2>
        </div>
        <div className="achievements-grid">
          <div className="achievement unlocked">
            <div className="achievement-icon">
              <FileText className="w-8 h-8" />
            </div>
            <div className="achievement-content">
              <h4>First Note</h4>
              <p>You created your first note</p>
            </div>
            <div className="achievement-badge">
              <span>✓</span>
            </div>
          </div>
          
          <div className="achievement unlocked">
            <div className="achievement-icon">
              <Star className="w-8 h-8" />
            </div>
            <div className="achievement-content">
              <h4>Star Collector</h4>
              <p>Starred 10+ notes</p>
            </div>
            <div className="achievement-badge">
              <span>✓</span>
            </div>
          </div>
          
          <div className="achievement locked">
            <div className="achievement-icon">
              <Users className="w-8 h-8" />
            </div>
            <div className="achievement-content">
              <h4>Collaborator</h4>
              <p>Share 5 notes with others</p>
            </div>
            <div className="achievement-badge">
              <span>🔒</span>
            </div>
          </div>
          
          <div className="achievement locked">
            <div className="achievement-icon">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="achievement-content">
              <h4>Consistent</h4>
              <p>30-day note streak</p>
            </div>
            <div className="achievement-badge">
              <span>🔒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}