"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Search, Bell, Settings, User, Menu, X, Moon, Sun } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ onMenuClick, sidebarOpen }) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const notificationsRef = useRef(null);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  // برای بستن نوتیفیکیشن‌ها وقتی بیرون کلیک میشه
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // منوی نوتیفیکیشن‌ها
  const notifications = [
    { id: 1, title: "New note created", message: "You created a new note", time: "2 min ago", unread: true },
    { id: 2, title: "Folder updated", message: "Your work folder was updated", time: "1 hour ago", unread: true },
    { id: 3, title: "Weekly summary", message: "Your weekly notes summary is ready", time: "1 day ago", unread: false },
    { id: 4, title: "Storage warning", message: "You're using 85% of your storage", time: "2 days ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

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
  );
}