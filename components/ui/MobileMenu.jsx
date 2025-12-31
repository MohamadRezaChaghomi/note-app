// components/ui/MobileMenu.jsx
"use client";

import { useState, useEffect } from "react";
import { 
  Menu, X, Home, FileText, Folder, 
  Users, Settings, Search, Bell,
  User, LogOut, Moon, Sun, HelpCircle,
  ChevronRight, Plus, Star, Download
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const pathname = usePathname();

  useEffect(() => {
    // Close menu on route change
    setIsOpen(false);
    
    // Determine active section from pathname
    if (pathname.includes("/notes")) setActiveSection("notes");
    else if (pathname.includes("/folders")) setActiveSection("folders");
    else if (pathname.includes("/team")) setActiveSection("team");
    else if (pathname.includes("/settings")) setActiveSection("settings");
    else setActiveSection("dashboard");
  }, [pathname]);

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would update your theme here
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      href: "/dashboard",
      badge: null
    },
    {
      id: "notes",
      label: "Notes",
      icon: FileText,
      href: "/dashboard/notes",
      badge: "12"
    },
    {
      id: "folders",
      label: "Folders",
      icon: Folder,
      href: "/dashboard/folders",
      badge: null
    },
    {
      id: "team",
      label: "Team",
      icon: Users,
      href: "/dashboard/team",
      badge: "3"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      badge: null
    }
  ];

  const quickActions = [
    {
      label: "New Note",
      icon: Plus,
      action: () => console.log("New Note")
    },
    {
      label: "Search",
      icon: Search,
      action: () => console.log("Search")
    },
    {
      label: "Starred",
      icon: Star,
      action: () => console.log("Starred")
    },
    {
      label: "Export",
      icon: Download,
      action: () => console.log("Export")
    }
  ];

  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: null
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <style jsx>{`
          .mobile-menu-button {
            display: none;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 0.5rem;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            cursor: pointer;
            transition: all 0.2s;
            z-index: 100;
          }
          
          @media (max-width: 768px) {
            .mobile-menu-button {
              display: flex;
            }
          }
          
          .mobile-menu-button:hover {
            background: #f3f4f6;
            border-color: #d1d5db;
          }
        `}</style>
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}>
        <style jsx>{`
          .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 90;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }
          
          .mobile-menu-overlay.open {
            opacity: 1;
            visibility: visible;
          }
          
          .mobile-menu-container {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 320px;
            background: white;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
          }
          
          .mobile-menu-overlay.open .mobile-menu-container {
            transform: translateX(0);
          }
          
          .menu-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          
          .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          
          .user-avatar {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            font-weight: 600;
          }
          
          .user-details h3 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
          }
          
          .user-details p {
            opacity: 0.8;
            font-size: 0.875rem;
          }
          
          .quick-stats {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
          }
          
          .stat-item {
            text-align: center;
            flex: 1;
          }
          
          .stat-value {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
          }
          
          .stat-label {
            font-size: 0.75rem;
            opacity: 0.8;
          }
          
          .menu-content {
            flex: 1;
            padding: 1rem 0;
            overflow-y: auto;
          }
          
          .section {
            padding: 0 1rem;
            margin-bottom: 1.5rem;
          }
          
          .section-title {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 0.5rem;
            padding: 0 1rem;
          }
          
          .menu-items {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          
          .menu-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            color: #374151;
            text-decoration: none;
            border-radius: 0.5rem;
            transition: background-color 0.2s;
            margin: 0 0.5rem;
          }
          
          .menu-item:hover {
            background: #f9fafb;
          }
          
          .menu-item.active {
            background: #f0f9ff;
            color: #1d4ed8;
            font-weight: 500;
          }
          
          .menu-item-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
          }
          
          .menu-item-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.25rem;
            height: 1.25rem;
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
          
          .quick-actions-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            padding: 0 0.5rem;
          }
          
          .quick-action-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0.75rem;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
            gap: 0.5rem;
          }
          
          .quick-action-btn:hover {
            background: #f3f4f6;
            transform: translateY(-1px);
          }
          
          .quick-action-btn span {
            font-size: 0.75rem;
            color: #374151;
            font-weight: 500;
          }
          
          .menu-footer {
            border-top: 1px solid #e5e7eb;
            padding: 1rem;
          }
          
          .footer-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .footer-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .footer-btn:hover {
            background: #f3f4f6;
          }
          
          .footer-btn-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          
          .dark-mode-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            background: #f9fafb;
            border-radius: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          .toggle-switch {
            position: relative;
            width: 3rem;
            height: 1.5rem;
          }
          
          .toggle-track {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #d1d5db;
            border-radius: 9999px;
            transition: background-color 0.2s;
          }
          
          .toggle-track.active {
            background: #10b981;
          }
          
          .toggle-thumb {
            position: absolute;
            top: 0.125rem;
            left: 0.125rem;
            width: 1.25rem;
            height: 1.25rem;
            background: white;
            border-radius: 50%;
            transition: transform 0.2s;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
          
          .toggle-thumb.active {
            transform: translateX(1.5rem);
          }
        `}</style>
        
        <div className="mobile-menu-container">
          {/* Header with User Info */}
          <div className="menu-header">
            <div className="user-info">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name.charAt(0)}</span>
                )}
              </div>
              <div className="user-details">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            </div>
            
            <div className="quick-stats">
              <div className="stat-item">
                <div className="stat-value">24</div>
                <div className="stat-label">Notes</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">5</div>
                <div className="stat-label">Folders</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">87%</div>
                <div className="stat-label">Done</div>
              </div>
            </div>
          </div>
          
          {/* Menu Content */}
          <div className="menu-content">
            {/* Main Navigation */}
            <div className="section">
              <div className="section-title">Main</div>
              <div className="menu-items">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`menu-item ${isActive ? 'active' : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="menu-item-content">
                        <span className="menu-item-icon">
                          <Icon className="w-5 h-5" />
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="menu-badge">{item.badge}</span>
                      )}
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="section">
              <div className="section-title">Quick Actions</div>
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      className="quick-action-btn"
                      onClick={() => {
                        action.action();
                        setIsOpen(false);
                      }}
                    >
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span>{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Recent Notes */}
            <div className="section">
              <div className="section-title">Recent Notes</div>
              <div className="menu-items">
                {["Meeting Notes", "Shopping List", "Project Ideas", "Learning Log"].map((note, index) => (
                  <div key={index} className="menu-item">
                    <div className="menu-item-content">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{note}</span>
                    </div>
                    <span className="text-xs text-gray-400">2h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="menu-footer">
            <div className="dark-mode-toggle">
              <div className="footer-btn-content">
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </div>
              <div className="toggle-switch" onClick={toggleDarkMode}>
                <div className={`toggle-track ${isDarkMode ? 'active' : ''}`}></div>
                <div className={`toggle-thumb ${isDarkMode ? 'active' : ''}`}></div>
              </div>
            </div>
            
            <div className="footer-actions">
              <button className="footer-btn">
                <div className="footer-btn-content">
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button className="footer-btn">
                <div className="footer-btn-content">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}