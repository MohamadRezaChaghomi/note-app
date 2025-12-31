// components/ui/Notifications.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bell, CheckCircle, AlertCircle, 
  Info, Star, Users, FileText,
  X, Check, Settings, MoreVertical,
  Clock, UserPlus, Download
} from "lucide-react";
import Link from "next/link";

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(3);
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef(null);

  // Sample notifications data
  const sampleNotifications = [
    {
      id: 1,
      title: "New Note Shared",
      description: "Sarah shared 'Meeting Notes' with you",
      time: "Just now",
      icon: FileText,
      iconColor: "text-blue-600 bg-blue-100",
      type: "share",
      read: false
    },
    {
      id: 2,
      title: "Daily Goal Achieved",
      description: "You've completed your daily writing goal! 🎉",
      time: "2 hours ago",
      icon: CheckCircle,
      iconColor: "text-green-600 bg-green-100",
      type: "achievement",
      read: false
    },
    {
      id: 3,
      title: "Team Member Added",
      description: "John has been added to your team",
      time: "4 hours ago",
      icon: UserPlus,
      iconColor: "text-purple-600 bg-purple-100",
      type: "team",
      read: false
    },
    {
      id: 4,
      title: "Export Complete",
      description: "Your notes have been exported successfully",
      time: "Yesterday",
      icon: Download,
      iconColor: "text-yellow-600 bg-yellow-100",
      type: "system",
      read: true
    },
    {
      id: 5,
      title: "Storage Warning",
      description: "You're using 85% of your storage",
      time: "2 days ago",
      icon: AlertCircle,
      iconColor: "text-red-600 bg-red-100",
      type: "warning",
      read: true
    },
    {
      id: 6,
      title: "New Feature",
      description: "Try out the new AI writing assistant",
      time: "3 days ago",
      icon: Star,
      iconColor: "text-indigo-600 bg-indigo-100",
      type: "feature",
      read: true
    }
  ];

  useEffect(() => {
    setNotifications(sampleNotifications);
    const count = sampleNotifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotification = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: !notif.read } : notif
    ));
    
    const updatedUnread = notifications.filter(n => 
      n.id === id ? !n.read : !n.read
    ).length;
    setUnreadCount(updatedUnread);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const displayedNotifications = showAll 
    ? notifications 
    : notifications.slice(0, 4);

  const getTimeAgo = (timeString) => {
    // Simple time ago calculation
    return timeString;
  };

  return (
    <div className="notifications-container" ref={dropdownRef}>
      <style jsx>{`
        .notifications-container {
          position: relative;
        }
        
        .notifications-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .notifications-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .notifications-btn.active {
          background: #eff6ff;
          border-color: #3b82f6;
        }
        
        .notification-badge {
          position: absolute;
          top: -0.25rem;
          right: -0.25rem;
          min-width: 1.25rem;
          height: 1.25rem;
          padding: 0 0.375rem;
          background: #dc2626;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }
        
        .notifications-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 380px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          margin-top: 0.5rem;
          transform-origin: top right;
          transform: scale(0.95);
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
        }
        
        .notifications-dropdown.open {
          transform: scale(1);
          opacity: 1;
          visibility: visible;
        }
        
        .dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .dropdown-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .header-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.75rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .header-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .notifications-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .notification-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.2s;
          position: relative;
        }
        
        .notification-item:hover {
          background: #f9fafb;
        }
        
        .notification-item.unread {
          background: #f0f9ff;
        }
        
        .notification-item.unread:hover {
          background: #e0f2fe;
        }
        
        .notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          flex-shrink: 0;
        }
        
        .notification-content {
          flex: 1;
          min-width: 0;
        }
        
        .notification-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }
        
        .notification-description {
          font-size: 0.75rem;
          color: #6b7280;
          line-height: 1.4;
          margin-bottom: 0.25rem;
        }
        
        .notification-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.625rem;
          color: #9ca3af;
        }
        
        .notification-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        .notification-item:hover .notification-actions {
          opacity: 1;
        }
        
        .notification-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 0.375rem;
          background: white;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .notification-action-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .unread-dot {
          position: absolute;
          top: 0.875rem;
          left: 0.5rem;
          width: 0.5rem;
          height: 0.5rem;
          background: #3b82f6;
          border-radius: 50%;
        }
        
        .dropdown-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }
        
        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: #3b82f6;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .view-all-btn:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #9ca3af;
          text-align: center;
        }
        
        .empty-state svg {
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 640px) {
          .notifications-dropdown {
            position: fixed;
            top: 4rem;
            right: 1rem;
            left: 1rem;
            width: auto;
            max-width: 100%;
          }
        }
      `}</style>

      <button 
        className={`notifications-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount}
          </span>
        )}
      </button>

      <div className={`notifications-dropdown ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-header">
          <div className="dropdown-title">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          
          <div className="header-actions">
            <button 
              className="header-btn"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <Check className="w-3 h-3" />
              Mark all read
            </button>
            <button 
              className="header-btn"
              onClick={clearAll}
              disabled={notifications.length === 0}
            >
              <X className="w-3 h-3" />
              Clear all
            </button>
          </div>
        </div>

        <div className="notifications-list">
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((notification) => {
              const Icon = notification.icon;
              
              return (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  {!notification.read && <div className="unread-dot"></div>}
                  
                  <div className={`notification-icon ${notification.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-description">
                      {notification.description}
                    </div>
                    <div className="notification-time">
                      <Clock className="w-3 h-3" />
                      {getTimeAgo(notification.time)}
                    </div>
                  </div>
                  
                  <div className="notification-actions">
                    <button 
                      className="notification-action-btn"
                      onClick={() => toggleNotification(notification.id)}
                      title={notification.read ? "Mark as unread" : "Mark as read"}
                    >
                      {notification.read ? (
                        <Bell className="w-3 h-3" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                    </button>
                    <button 
                      className="notification-action-btn"
                      title="More options"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <Bell className="w-8 h-8" />
              <p>No notifications</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          )}
        </div>

        {notifications.length > 4 && (
          <div className="dropdown-footer">
            <button 
              className="view-all-btn"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : `View all (${notifications.length})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}