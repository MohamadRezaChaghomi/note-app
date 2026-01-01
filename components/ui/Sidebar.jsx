"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, FileText, Search, BarChart3, Settings,
  Folder, Users, Calendar, Bookmark, HelpCircle,
  LogOut, ChevronLeft, ChevronRight, Sparkles,
  PlusCircle, User, Menu, X
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const mainItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home, badge: null },
  { href: "/dashboard/notes", label: "Notes", icon: FileText, badge: null },
  { href: "/dashboard/folders", label: "Folders", icon: Folder, badge: null },
  { href: "/dashboard/search", label: "Search", icon: Search, badge: null },
  { href: "/report", label: "Reports", icon: BarChart3, badge: "New" },
];

const secondaryItems = [
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [notesCount, setNotesCount] = useState(null);

  // Fetch tags from API
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const data = await res.json();
          setTags(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  // Fetch notes count
  useEffect(() => {
    const fetchNotesCount = async () => {
      try {
        const res = await fetch("/api/notes?limit=1");
        if (res.ok) {
          const data = await res.json();
          setNotesCount(data.pagination?.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch notes count:", error);
      }
    };
    fetchNotesCount();
  }, []);

  const updatedMainItems = mainItems.map(item => {
    if (item.href === "/dashboard/notes" && notesCount !== null) {
      return { ...item, badge: notesCount.toString() };
    }
    return item;
  });

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="mobile-menu-toggle">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="menu-button"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : 'expanded'} ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Sparkles className="w-6 h-6" />
            </div>
            {!collapsed && (
              <div className="logo-text">
                <h1>Web Notes</h1>
                <span className="version">v2.0</span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="toggle-button"
            aria-label={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="quick-add">
            <Link href="/dashboard/notes/new" className="quick-add-button" onClick={() => setIsOpen(false)}>
              <PlusCircle className="w-5 h-5" />
              <span>New Note</span>
            </Link>
          </div>
        )}

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="section-title">MAIN</h3>
            <div className="nav-items">
              {updatedMainItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                    <div className="nav-icon"><Icon className="w-5 h-5" /></div>
                    {!collapsed && (
                      <>
                        <span className="nav-label">{item.label}</span>
                        {item.badge && <span className={`nav-badge ${item.badge === 'New' ? 'new' : ''}`}>{item.badge}</span>}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="nav-section">
            <h3 className="section-title">WORKSPACE</h3>
            <div className="nav-items">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                    <div className="nav-icon"><Icon className="w-5 h-5" /></div>
                    {!collapsed && <span className="nav-label">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {!collapsed && tags.length > 0 && (
          <div className="tags-section">
            <div className="section-header">
              <h3 className="section-title">TAGS</h3>
              <button className="add-tag" title="Create new tag">+</button>
            </div>
            <div className="tags-list">
              {tags.map((tag) => (
                <button key={tag._id} className="tag-item" title={`${tag.name}`} onClick={() => setIsOpen(false)}>
                  <div className="tag-color" style={{ backgroundColor: tag.color || getTagColor(tag.name) }} />
                  <span className="tag-name">{tag.name}</span>
                  <span className="tag-count">{tag.count || 0}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="user-profile">
          <div className="user-avatar"><User className="w-6 h-6" /></div>
          {!collapsed && session?.user && (
            <div className="user-info">
              <div className="user-name">{session.user.name || 'User'}</div>
              <div className="user-email">{session.user.email}</div>
            </div>
          )}
          <button onClick={() => signOut({ callbackUrl: "/" })} className="logout-button" title="Sign out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}

function getTagColor(tagName) {
  const colors = {
    Work: "#3b82f6",
    Personal: "#10b981",
    Ideas: "#8b5cf6",
    Projects: "#f59e0b",
    Meeting: "#ef4444",
    Important: "#ff006e",
    Review: "#06d6d0",
    Archive: "#a0aec0",
  };
  return colors[tagName] || "#6b7280";
}
