"use client";

import { useSession } from "next-auth/react";
import { Menu, X, Settings, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
export default function Navbar({ onMenuClick, sidebarOpen }) {
  const { data: session } = useSession();

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
          <span className="navbar-subtitle">Dashboard</span>
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