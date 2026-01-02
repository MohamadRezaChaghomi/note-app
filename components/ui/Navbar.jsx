"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Search, Bell, Settings, User, Menu, X, Moon, Sun } from "lucide-react";

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

      {/* Center Section - Search */}
      <div className="navbar-center">
        <form onSubmit={handleSearch} className="navbar-search">
          <Search className="navbar-search-icon" size={18} />
          <input
            type="text"
            placeholder="Search notes, folders, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="navbar-search-clear"
            >
              ×
            </button>
          )}
        </form>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="navbar-icon-btn"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="navbar-notifications" ref={notificationsRef}>
          <button
            onClick={toggleNotifications}
            className="navbar-icon-btn"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notifications</h3>
                <button className="mark-all-read">Mark all as read</button>
              </div>
              <div className="notifications-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                    >
                      <div className="notification-icon">
                        <Bell size={16} />
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    <Bell size={32} />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
              <a href="/dashboard/notifications" className="notifications-footer">
                View all notifications
              </a>
            </div>
          )}
        </div>

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