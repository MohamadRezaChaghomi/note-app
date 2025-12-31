// components/ui/UserMenu.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { 
  User, Settings, LogOut, HelpCircle,
  Moon, Sun, CreditCard, Users,
  Bell, Shield, Globe, Palette,
  ChevronRight, Check, Mail,
  Calendar, FileText, Star,
  TrendingUp, Key, Database,
  ExternalLink, MoreVertical,
  X, Menu, Home
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function UserMenu({ 
  showAvatar = true,
  showName = true,
  compact = false,
  position = "bottom-right",
  className = "",
  onProfileClick = null,
  onSettingsClick = null,
  onSignOut = null
}) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeView, setActiveView] = useState("main");
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [userStats, setUserStats] = useState({
    notes: 24,
    starred: 8,
    folders: 5,
    streak: 7
  });

  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const router = useRouter();

  // Mock user data
  const user = {
    name: session?.user?.name || "John Doe",
    email: session?.user?.email || "john@example.com",
    avatar: session?.user?.image || null,
    role: "Premium User",
    plan: "Pro",
    joinDate: "2024-01-15",
    verified: true
  };

  const positionStyles = {
    "bottom-right": "top-full right-0 mt-2",
    "bottom-left": "top-full left-0 mt-2",
    "top-right": "bottom-full right-0 mb-2",
    "top-left": "bottom-full left-0 mb-2"
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveView("main");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Check for dark mode preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would update your theme here
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  const mainMenuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "View your profile",
      badge: null,
      action: () => {
        if (onProfileClick) onProfileClick();
        else router.push("/dashboard/profile");
        setIsOpen(false);
      }
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Account settings",
      badge: null,
      action: () => {
        if (onSettingsClick) onSettingsClick();
        else router.push("/dashboard/settings");
        setIsOpen(false);
      }
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Manage notifications",
      badge: notificationsCount > 0 ? notificationsCount.toString() : null,
      action: () => {
        router.push("/dashboard/notifications");
        setIsOpen(false);
      }
    },
    {
      id: "team",
      label: "Team",
      icon: Users,
      description: "Manage team members",
      badge: "2",
      action: () => {
        router.push("/dashboard/team");
        setIsOpen(false);
      }
    },
    {
      id: "billing",
      label: "Billing",
      icon: CreditCard,
      description: "Manage subscription",
      badge: user.plan,
      action: () => {
        router.push("/dashboard/billing");
        setIsOpen(false);
      }
    }
  ];

  const secondaryMenuItems = [
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      action: () => {
        router.push("/help");
        setIsOpen(false);
      }
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: Shield,
      action: () => {
        router.push("/privacy");
        setIsOpen(false);
      }
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
      action: () => setActiveView("appearance"),
      rightIcon: ChevronRight
    },
    {
      id: "language",
      label: "Language",
      icon: Globe,
      action: () => setActiveView("language"),
      rightIcon: ChevronRight
    }
  ];

  const appearanceOptions = [
    { id: "light", label: "Light", icon: Sun, active: !isDarkMode },
    { id: "dark", label: "Dark", icon: Moon, active: isDarkMode },
    { id: "system", label: "System", icon: Settings, active: false }
  ];

  const languageOptions = [
    { id: "en", label: "English", code: "EN", active: true },
    { id: "fa", label: "فارسی", code: "FA", active: false },
    { id: "es", label: "Español", code: "ES", active: false },
    { id: "fr", label: "Français", code: "FR", active: false }
  ];

  const quickStats = [
    { label: "Notes", value: userStats.notes, icon: FileText, color: "text-blue-500" },
    { label: "Starred", value: userStats.starred, icon: Star, color: "text-yellow-500" },
    { label: "Streak", value: `${userStats.streak} days`, icon: TrendingUp, color: "text-green-500" }
  ];

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
    } else {
      await signOut({ redirect: false });
      router.push("/auth/signin");
    }
    setIsOpen(false);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderMainView = () => (
    <>
      {/* User Header */}
      <div className="user-header">
        <div className="user-info">
          <div className="user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span className="avatar-fallback">{getInitials(user.name)}</span>
            )}
            {user.verified && (
              <div className="verified-badge">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>
          <div className="user-details">
            <h3 className="user-name">{user.name}</h3>
            <p className="user-email">{user.email}</p>
            <div className="user-plan">
              <span className="plan-badge">{user.plan}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
        </div>

        <div className="quick-stats">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-item">
                <Icon className={`stat-icon ${stat.color}`} />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Menu Items */}
      <div className="menu-section">
        <div className="section-title">Account</div>
        <div className="menu-items">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="menu-item"
                onClick={item.action}
              >
                <div className="menu-item-content">
                  <div className="menu-item-icon">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="menu-item-text">
                    <div className="menu-item-label">{item.label}</div>
                    <div className="menu-item-description">{item.description}</div>
                  </div>
                </div>
                <div className="menu-item-right">
                  {item.badge && (
                    <span className="menu-badge">{item.badge}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Menu Items */}
      <div className="menu-section">
        <div className="section-title">Preferences</div>
        <div className="menu-items">
          {secondaryMenuItems.map((item) => {
            const Icon = item.icon;
            const RightIcon = item.rightIcon;
            return (
              <button
                key={item.id}
                className="menu-item"
                onClick={item.action}
              >
                <div className="menu-item-content">
                  <div className="menu-item-icon">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="menu-item-label">{item.label}</div>
                </div>
                {RightIcon && (
                  <div className="menu-item-right">
                    <RightIcon className="w-4 h-4 text-gray-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  const renderAppearanceView = () => (
    <div className="appearance-view">
      <div className="view-header">
        <button 
          className="back-btn"
          onClick={() => setActiveView("main")}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>
        <h3 className="view-title">Appearance</h3>
      </div>

      <div className="appearance-options">
        {appearanceOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              className={`appearance-option ${option.active ? 'active' : ''}`}
              onClick={() => {
                if (option.id === "dark" || option.id === "light") {
                  setIsDarkMode(option.id === "dark");
                }
              }}
            >
              <div className="option-icon">
                <Icon className="w-5 h-5" />
              </div>
              <div className="option-label">{option.label}</div>
              {option.active && (
                <div className="option-check">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="color-themes">
        <h4 className="themes-title">Color Themes</h4>
        <div className="themes-grid">
          {["blue", "green", "purple", "orange", "pink"].map((color) => (
            <button
              key={color}
              className={`color-theme ${color}`}
              onClick={() => console.log(`Change theme to ${color}`)}
            >
              <div className="theme-preview"></div>
              <span className="theme-label">{color}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLanguageView = () => (
    <div className="language-view">
      <div className="view-header">
        <button 
          className="back-btn"
          onClick={() => setActiveView("main")}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span>Back</span>
        </button>
        <h3 className="view-title">Language</h3>
      </div>

      <div className="language-options">
        {languageOptions.map((language) => (
          <button
            key={language.id}
            className={`language-option ${language.active ? 'active' : ''}`}
            onClick={() => console.log(`Change language to ${language.id}`)}
          >
            <div className="language-content">
              <span className="language-label">{language.label}</span>
              <span className="language-code">{language.code}</span>
            </div>
            {language.active && (
              <div className="language-check">
                <Check className="w-4 h-4" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`user-menu-container ${className}`}>
      <style jsx>{`
        .user-menu-container {
          position: relative;
          display: inline-block;
        }
        
        .trigger-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: ${compact ? '0.25rem 0.5rem' : '0.5rem 0.75rem'};
          background: ${compact ? 'transparent' : '#f9fafb'};
          border: 1px solid ${compact ? 'transparent' : '#e5e7eb'};
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          min-width: ${compact ? 'auto' : '180px'};
        }
        
        .trigger-btn:hover {
          background: ${compact ? 'transparent' : '#f3f4f6'};
          border-color: ${compact ? 'transparent' : '#d1d5db'};
        }
        
        .trigger-btn.compact {
          padding: 0.375rem;
          min-width: auto;
        }
        
        .user-avatar {
          position: relative;
          width: ${compact ? '1.75rem' : '2rem'};
          height: ${compact ? '1.75rem' : '2rem'};
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-fallback {
          color: white;
          font-weight: 600;
          font-size: 0.75rem;
        }
        
        .verified-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 1rem;
          height: 1rem;
          background: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: 2px solid white;
        }
        
        .user-info-text {
          display: ${compact ? 'none' : 'flex'};
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
          min-width: 0;
        }
        
        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 120px;
        }
        
        .user-role {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .chevron-icon {
          display: ${compact ? 'none' : 'block'};
          color: #9ca3af;
          transition: transform 0.2s;
        }
        
        .chevron-icon.open {
          transform: rotate(180deg);
        }
        
        .user-menu {
          position: absolute;
          ${positionStyles[position]};
          width: 320px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          opacity: 0;
          transform: scale(0.95) translateY(-10px);
          visibility: hidden;
          transition: all 0.2s ease;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .user-menu.open {
          opacity: 1;
          transform: scale(1) translateY(0);
          visibility: visible;
        }
        
        .user-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 0.75rem 0.75rem 0 0;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .user-details h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .user-details p {
          opacity: 0.9;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .user-plan {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .plan-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .user-role {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-icon {
          margin-bottom: 0.25rem;
          width: 1.25rem;
          height: 1.25rem;
          margin: 0 auto 0.25rem;
        }
        
        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.125rem;
        }
        
        .stat-label {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        
        .menu-section {
          padding: 1rem 0;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .section-title {
          padding: 0 1.5rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
        }
        
        .menu-items {
          display: flex;
          flex-direction: column;
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
          text-align: left;
        }
        
        .menu-item:hover {
          background: #f9fafb;
        }
        
        .menu-item-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 0;
        }
        
        .menu-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: #f3f4f6;
          color: #374151;
          flex-shrink: 0;
        }
        
        .menu-item-text {
          flex: 1;
          min-width: 0;
        }
        
        .menu-item-label {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.125rem;
        }
        
        .menu-item-description {
          font-size: 0.75rem;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .menu-item-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        
        .menu-badge {
          background: #dc2626;
          color: white;
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-weight: 600;
          min-width: 1.5rem;
          text-align: center;
        }
        
        .view-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #6b7280;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s;
        }
        
        .back-btn:hover {
          background: #f3f4f6;
        }
        
        .view-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }
        
        .appearance-options {
          padding: 1rem 1.5rem;
        }
        
        .appearance-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .appearance-option.active {
          background: #eff6ff;
          border-color: #3b82f6;
        }
        
        .appearance-option:hover:not(.active) {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .option-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: white;
          color: #374151;
        }
        
        .option-label {
          flex: 1;
          margin-left: 0.75rem;
          font-weight: 500;
          color: #1f2937;
        }
        
        .option-check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: #3b82f6;
          color: white;
        }
        
        .color-themes {
          padding: 1rem 1.5rem;
          border-top: 1px solid #f3f4f6;
        }
        
        .themes-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
        }
        
        .themes-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }
        
        .color-theme {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.5rem 0;
        }
        
        .theme-preview {
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          border: 2px solid #e5e7eb;
        }
        
        .color-theme.blue .theme-preview {
          background: #3b82f6;
        }
        
        .color-theme.green .theme-preview {
          background: #10b981;
        }
        
        .color-theme.purple .theme-preview {
          background: #8b5cf6;
        }
        
        .color-theme.orange .theme-preview {
          background: #f97316;
        }
        
        .color-theme.pink .theme-preview {
          background: #ec4899;
        }
        
        .theme-label {
          font-size: 0.625rem;
          color: #6b7280;
          text-transform: capitalize;
        }
        
        .language-options {
          padding: 1rem 1.5rem;
        }
        
        .language-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .language-option.active {
          background: #eff6ff;
          border-color: #3b82f6;
        }
        
        .language-option:hover:not(.active) {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .language-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .language-label {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.125rem;
        }
        
        .language-code {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .language-check {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: #3b82f6;
          color: white;
        }
        
        .menu-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #f3f4f6;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .footer-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
          color: #374151;
        }
        
        .footer-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .sign-out-btn {
          color: #dc2626;
        }
        
        .sign-out-btn:hover {
          background: #fee2e2;
          border-color: #fecaca;
        }
        
        .footer-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1rem;
          height: 1rem;
        }
        
        @media (max-width: 640px) {
          .user-menu {
            position: fixed;
            top: 4rem;
            right: 1rem;
            left: 1rem;
            width: auto;
            max-width: 100%;
          }
          
          .trigger-btn:not(.compact) {
            min-width: auto;
            padding: 0.5rem;
          }
          
          .user-name {
            display: none;
          }
        }
      `}</style>

      <button
        ref={triggerRef}
        className={`trigger-btn ${compact ? 'compact' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {showAvatar && (
          <div className="user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span className="avatar-fallback">{getInitials(user.name)}</span>
            )}
          </div>
        )}
        
        {showName && !compact && (
          <div className="user-info-text">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        )}
        
        <div className={`chevron-icon ${isOpen ? 'open' : ''}`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      <div 
        ref={menuRef}
        className={`user-menu ${isOpen ? 'open' : ''}`}
      >
        {activeView === "main" && renderMainView()}
        {activeView === "appearance" && renderAppearanceView()}
        {activeView === "language" && renderLanguageView()}

        <div className="menu-footer">
          <button className="footer-btn" onClick={handleSignOut}>
            <div className="footer-icon">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Compact User Avatar Component
export function UserAvatar({ 
  user,
  size = "md",
  showStatus = false,
  onClick = null
}) {
  const getSizeClass = () => {
    switch (size) {
      case "sm": return "w-8 h-8 text-xs";
      case "md": return "w-10 h-10 text-sm";
      case "lg": return "w-12 h-12 text-base";
      case "xl": return "w-16 h-16 text-lg";
      default: return "w-10 h-10 text-sm";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-avatar-container">
      <style jsx>{`
        .user-avatar-container {
          position: relative;
          display: inline-block;
        }
        
        .avatar {
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: ${onClick ? 'pointer' : 'default'};
          transition: transform 0.2s;
        }
        
        .avatar:hover {
          transform: ${onClick ? 'scale(1.05)' : 'none'};
        }
        
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-fallback {
          color: white;
          font-weight: 600;
        }
        
        .status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .status-online {
          background: #10b981;
        }
        
        .status-offline {
          background: #6b7280;
        }
        
        .status-away {
          background: #f59e0b;
        }
        
        .status-busy {
          background: #dc2626;
        }
      `}</style>

      <div 
        className={`avatar ${getSizeClass()}`}
        onClick={onClick}
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name || "User"} />
        ) : (
          <span className="avatar-fallback">
            {getInitials(user?.name || "User")}
          </span>
        )}
      </div>
      
      {showStatus && user?.status && (
        <div className={`status-dot status-${user.status}`} />
      )}
    </div>
  );
}