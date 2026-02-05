"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X, Settings, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const getPageName = (pathname) => {
  if (!pathname) return "Dashboard";
  
  const segments = pathname.split("/").filter(Boolean);
  
  // Handle special cases for nested pages
  if (segments.includes("notes")) {
    if (segments.includes("new")) return "Create New Note";
    if (segments.includes("edit")) return "Edit Note";
    if (segments.length > 2 && segments[segments.length - 1] !== "notes") return "Note Details";
    return "Notes";
  }
  
  if (segments.includes("folders")) {
    if (segments.includes("new")) return "Create New Folder";
    if (segments.includes("edit")) return "Edit Folder";
    if (segments.length > 2 && segments[segments.length - 1] !== "folders") return "Folder Details";
    return "Folders";
  }
  
  if (segments.includes("tags")) {
    if (segments.includes("new")) return "Create New Tag";
    if (segments.includes("edit")) return "Edit Tag";
    if (segments.length > 2 && segments[segments.length - 1] !== "tags") return "Tag Details";
    return "Tags";
  }
  
  const pageNames = {
    dashboard: "Dashboard",
    notes: "Notes",
    folders: "Folders",
    tags: "Tags",
    report: "Reports",
    search: "Search",
    settings: "Settings",
    security: "Security",
    help: "Help & Support",
    profile: "Profile",
  };
  
  const lastSegment = segments[segments.length - 1];
  return pageNames[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
};

export default function Navbar({ onMenuClick, sidebarOpen }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const pageName = getPageName(pathname);

  return (
    <div className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        {/* Hamburger Menu Button */}
        <button 
          onClick={onMenuClick}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="navbar-brand">
          <h1 className="navbar-title">Web Notes</h1>
          <span className="navbar-subtitle">{pageName}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {/* Dark Mode Toggle */}
        <ThemeToggle/>

        {/* Settings */}
        <a href="/dashboard/settings" className="navbar-icon-btn" title="Settings">
          <Settings size={20} />
        </a>

        {/* User Profile */}
        <a href="/dashboard/profile" className="navbar-icon-btn" title="Profile">
          <User size={20} />
        </a>
      </div>
    </div>
  )
;}