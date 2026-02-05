"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  FileText,
  Search,
  BarChart3,
  Settings,
  Folder,
  Users,
  Calendar,
  Bookmark,
  HelpCircle,
  LogOut,
  Sparkles,
  PlusCircle,
  User,
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  TrendingUp,
  Bell,
  Download,
  Upload,
  Tag,
  Layers,
  Grid,
  PieChart,
  FileCode,
  Database,
  Shield,
  Zap,
  Menu,
  X
} from "lucide-react";
import "@/styles/sidebar.css";

// Navigation items with icons and badges
const mainItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home, exact: true },
  { href: "/dashboard/notes", label: "Notes", icon: FileText },
  { href: "/dashboard/folders", label: "Folders", icon: Folder },
  { href: "/dashboard/tags", label: "Tags", icon: Tag },
  { href: "/dashboard/report", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/search", label: "Search", icon: Search },
];


const adminItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/security", label: "Security", icon: Shield },
  { href: "/dashboard/help", label: "Help & Support", icon: HelpCircle },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [notesCount, setNotesCount] = useState(0);
  const [foldersCount, setFoldersCount] = useState(0);
  const [tagsCount, setTagsCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    main: true,
    secondary: true,
    admin: false
  });
  const [recentNotes, setRecentNotes] = useState([]);

  // Fetch counts and recent notes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, recentRes] = await Promise.all([
          fetch('/api/report'),
          fetch('/api/notes?limit=3&sort=-createdAt')
        ]);

        if (reportRes.ok) {
          const r = await reportRes.json();
          const summary = r.systemSummary || {};
          setNotesCount(summary.totalNotes || 0);
          setFoldersCount(summary.totalFolders || 0);
          setTagsCount(summary.totalTags || 0);
        }

        if (recentRes.ok) {
          const recentData = await recentRes.json();
          setRecentNotes(recentData.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      }
    };

    fetchData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Check if a link is active
  const isActive = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  // Get badge text
  const getBadgeText = (item) => {
    if (item.href === '/dashboard/notes') return notesCount > 99 ? '99+' : String(notesCount);
    if (item.href === '/dashboard/folders') return foldersCount > 99 ? '99+' : String(foldersCount);
    if (item.href === '/dashboard/tags') return tagsCount > 99 ? '99+' : String(tagsCount);
    return null;
  };

  // Format time ago
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
  };

  return (
    <aside className={`sidebar`}>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="quick-actions-section">
          <Link href="/dashboard/notes/new" className="quick-action-button">
            <PlusCircle size={20} />
            <span>New Note</span>
            <div className="quick-action-badge">
              <Zap size={12} />
            </div>
          </Link>
          
          <div className="quick-stats">
            <div className="quick-stat">
              <FileText size={16} />
              <span>{notesCount}</span>
              <span>Notes</span>
            </div>
            <div className="quick-stat">
              <Folder size={16} />
              <span>{foldersCount}</span>
              <span>Folders</span>
            </div>
            <div className="quick-stat">
              <Tag size={16} />
              <span>{tagsCount}</span>
              <span>Tags</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="sidebar-nav">
        {/* Main Navigation */}
        <div className="nav-section">
          <div className="section-header" onClick={() => toggleSection("main")}>
            <span className="section-title">MAIN</span>
            <ChevronRight 
              className={`section-toggle ${expandedSections.main ? "expanded" : ""}`} 
              size={16} 
            />
          </div>
          
          {expandedSections.main && (
            <div className="nav-items">
              {mainItems.filter(item => {
                // Hide Report link for non-admin users
                if (item.href === "/dashboard/report" && session?.user?.role !== "admin") {
                  return false;
                }
                return true;
              }).map(item => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                const badgeText = getBadgeText(item);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${active ? "active" : ""}`}
                    onClick={onClose}
                  >
                    <div className="nav-item-content">
                      <Icon className="nav-icon" size={20} />
                      {!isCollapsed && (
                        <>
                          <span className="nav-label">{item.label}</span>
                          {badgeText && (
                            <span className={`nav-badge ${item.badge === "New" ? "new" : ""}`}>
                              {badgeText}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {active && !isCollapsed && (
                      <div className="nav-item-indicator" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Notes (only when expanded) */}
        {!isCollapsed && recentNotes.length > 0 && (
          <div className="nav-section">
            <div className="section-header">
              <span className="section-title">RECENT</span>
              <Clock className="section-icon" size={16} />
            </div>
            
            <div className="recent-notes">
              {recentNotes.slice(0, 3).map(note => (
                <div 
                  key={note._id}
                  className="recent-note"
                  onClick={() => {
                    router.push(`/dashboard/notes/${note._id}`);
                    onClose?.();
                  }}
                >
                  <div className="recent-note-icon">
                    <FileText size={16} />
                  </div>
                  <div className="recent-note-content">
                    <div className="recent-note-title">{note.title || "Untitled"}</div>
                    <div className="recent-note-time">
                      {timeAgo(note.createdAt)}
                    </div>
                  </div>
                  {note.isStarred && (
                    <Star className="recent-note-star" size={14} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Navigation */}
        <div className="nav-section">
          <div className="section-header" onClick={() => toggleSection("admin")}>
            <span className="section-title">ADMIN</span>
            <ChevronRight 
              className={`section-toggle ${expandedSections.admin ? "expanded" : ""}`} 
              size={16} 
            />
          </div>
          
          {expandedSections.admin && (
            <div className="nav-items">
              {adminItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${active ? "active" : ""}`}
                    onClick={onClose}
                  >
                    <div className="nav-item-content">
                      <Icon className="nav-icon" size={20} />
                      {!isCollapsed && <span className="nav-label">{item.label}</span>}
                    </div>
                    {active && !isCollapsed && (
                      <div className="nav-item-indicator" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name} 
                className="user-avatar-img"
              />
            ) : (
              <div className="user-avatar-fallback">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name">
                {session?.user?.name || "User"}
              </div>
              <div className="user-email">
                {session?.user?.email}
              </div>
            </div>
          )}
          
          <button
            className="logout-button"
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
        
      </div>

      {/* Collapsed sidebar tooltip container */}
      {isCollapsed && (
        <div className="collapsed-tooltips">
          {mainItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            
            return (
              <div 
                key={item.href}
                className={`collapsed-tooltip ${active ? "active" : ""}`}
                onClick={() => router.push(item.href)}
              >
                <Icon size={20} />
                <div className="tooltip-content">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}