"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, FileText, Search, BarChart3, Settings,
  Folder, Users, Calendar, Bookmark, HelpCircle,
  LogOut, ChevronLeft, ChevronRight, Sparkles,
  PlusCircle, Bell, User
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

const mainItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home, badge: null },
  { href: "/dashboard/notes", label: "Notes", icon: FileText, badge: "5" },
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
  const [collapsed, setCollapsed] = useState(false);
  const [activeGroup, setActiveGroup] = useState("notes");

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : 'expanded'}`}>
      {/* Sidebar Header */}
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
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Quick Add */}
      {!collapsed && (
        <div className="quick-add">
          <Link
            href="/dashboard/notes/new"
            className="quick-add-button"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Note</span>
          </Link>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="section-title">MAIN</h3>
          <div className="nav-items">
            {mainItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="nav-icon">
                    <Icon className="w-5 h-5" />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && (
                        <span className={`nav-badge ${item.badge === 'New' ? 'new' : ''}`}>
                          {item.badge}
                        </span>
                      )}
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
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <div className="nav-icon">
                    <Icon className="w-5 h-5" />
                  </div>
                  {!collapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Tags Section */}
      {!collapsed && (
        <div className="tags-section">
          <div className="section-header">
            <h3 className="section-title">TAGS</h3>
            <button className="add-tag">+</button>
          </div>
          <div className="tags-list">
            {["Work", "Personal", "Ideas", "Projects", "Meeting"].map((tag) => (
              <button
                key={tag}
                className={`tag-item ${activeGroup === tag.toLowerCase() ? 'active' : ''}`}
                onClick={() => setActiveGroup(tag.toLowerCase())}
              >
                <div className="tag-color" style={{ backgroundColor: getTagColor(tag) }} />
                <span className="tag-name">{tag}</span>
                <span className="tag-count">12</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="user-profile">
        <div className="user-avatar">
          <User className="w-6 h-6" />
        </div>
        
        {!collapsed && (
          <div className="user-info">
            <div className="user-name">John Doe</div>
            <div className="user-email">john@example.com</div>
          </div>
        )}
        
        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="logout-button"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

function getTagColor(tag) {
  const colors = {
    Work: "#3b82f6",
    Personal: "#10b981",
    Ideas: "#8b5cf6",
    Projects: "#f59e0b",
    Meeting: "#ef4444",
  };
  return colors[tag] || "#6b7280";
}