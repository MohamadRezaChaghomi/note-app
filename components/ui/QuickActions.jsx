// components/ui/QuickActions.jsx
"use client";

import { useState } from "react";
import { 
  Plus, Upload, FolderPlus, 
  Search, Share2, Settings,
  FileText, Users, Bell,
  Star, Download, Filter,
  Zap, Clock, TrendingUp,
  ChevronRight, X, MoreVertical
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const [expanded, setExpanded] = useState(false);
  const [recentActions, setRecentActions] = useState([
    { id: 1, label: "Export Notes", icon: Download, time: "2h ago" },
    { id: 2, label: "Starred Notes", icon: Star, time: "4h ago" },
    { id: 3, label: "Search", icon: Search, time: "Yesterday" }
  ]);
  const router = useRouter();

  const primaryActions = [
    {
      id: 1,
      label: "New Note",
      icon: Plus,
      color: "bg-blue-500",
      description: "Create a new note",
      shortcut: "Ctrl+N",
      action: () => router.push("/dashboard/notes/new")
    },
    {
      id: 2,
      label: "Search",
      icon: Search,
      color: "bg-green-500",
      description: "Find notes",
      shortcut: "Ctrl+K",
      action: () => router.push("/dashboard/search")
    },
    {
      id: 3,
      label: "Import",
      icon: Upload,
      color: "bg-purple-500",
      description: "Import files",
      shortcut: "Ctrl+I",
      action: () => router.push("/dashboard/import")
    }
  ];

  const secondaryActions = [
    {
      id: 4,
      label: "Folders",
      icon: FolderPlus,
      color: "bg-yellow-500",
      description: "Organize notes",
      action: () => router.push("/dashboard/folders")
    },
    {
      id: 5,
      label: "Share",
      icon: Share2,
      color: "bg-pink-500",
      description: "Share with team",
      action: () => router.push("/dashboard/share")
    },
    {
      id: 6,
      label: "Templates",
      icon: FileText,
      color: "bg-indigo-500",
      description: "Use templates",
      action: () => router.push("/dashboard/templates")
    },
    {
      id: 7,
      label: "Team",
      icon: Users,
      color: "bg-cyan-500",
      description: "Collaborate",
      action: () => router.push("/dashboard/team")
    },
    {
      id: 8,
      label: "Settings",
      icon: Settings,
      color: "bg-gray-500",
      description: "Customize",
      action: () => router.push("/dashboard/settings")
    },
    {
      id: 9,
      label: "Filter",
      icon: Filter,
      color: "bg-orange-500",
      description: "Filter notes",
      action: () => router.push("/dashboard/filter")
    }
  ];

  const quickStats = [
    { label: "Active", value: "24", change: "+12%" },
    { label: "Starred", value: "8", change: "+5%" },
    { label: "Shared", value: "3", change: "+2%" }
  ];

  const handleAction = (action) => {
    action.action();
    
    // Add to recent actions
    const newAction = {
      id: Date.now(),
      label: action.label,
      icon: action.icon,
      time: "Just now"
    };
    
    setRecentActions(prev => [newAction, ...prev.slice(0, 2)]);
  };

  const removeRecentAction = (id) => {
    setRecentActions(prev => prev.filter(action => action.id !== id));
  };

  return (
    <div className={`quick-actions-container ${expanded ? 'expanded' : ''}`}>
      <style jsx>{`
        .quick-actions-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 300px;
        }
        
        .quick-actions-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 0.75rem;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .quick-actions-header:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
        }
        
        .header-text h3 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }
        
        .header-text p {
          font-size: 0.75rem;
          opacity: 0.9;
        }
        
        .toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.375rem;
          background: rgba(255, 255, 255, 0.2);
          transition: transform 0.2s;
        }
        
        .toggle-btn.expanded {
          transform: rotate(180deg);
        }
        
        .quick-actions-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        
        .quick-actions-container.expanded .quick-actions-content {
          max-height: 500px;
        }
        
        .section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1rem;
        }
        
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }
        
        .primary-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        
        .primary-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1rem 0.5rem;
          border-radius: 0.5rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        
        .primary-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }
        
        .primary-action:active {
          transform: translateY(0);
        }
        
        .action-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          border-radius: 0.75rem;
          color: white;
          margin-bottom: 0.75rem;
        }
        
        .action-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        
        .action-description {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }
        
        .shortcut {
          font-size: 0.625rem;
          color: #9ca3af;
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
        
        .secondary-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        
        .secondary-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0.75rem 0.25rem;
          border-radius: 0.5rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .secondary-action:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .secondary-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          color: white;
          margin-bottom: 0.5rem;
        }
        
        .secondary-label {
          font-size: 0.75rem;
          color: #374151;
          font-weight: 500;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          text-align: center;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .stat-change {
          font-size: 0.625rem;
          color: #10b981;
          font-weight: 600;
        }
        
        .recent-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .recent-action {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: #f9fafb;
          transition: background-color 0.2s;
        }
        
        .recent-action:hover {
          background: #f3f4f6;
        }
        
        .recent-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 0.5rem;
          background: #e5e7eb;
          color: #374151;
        }
        
        .recent-content {
          flex: 1;
        }
        
        .recent-label {
          font-size: 0.875rem;
          color: #1f2937;
          font-weight: 500;
        }
        
        .recent-time {
          font-size: 0.75rem;
          color: #9ca3af;
        }
        
        .remove-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0.375rem;
          background: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .remove-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .customize-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #6b7280;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .customize-btn:hover {
          color: #374151;
        }
        
        .all-actions-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: #3b82f6;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s;
          text-decoration: none;
        }
        
        .all-actions-btn:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        
        @media (max-width: 640px) {
          .quick-actions-container {
            min-width: 100%;
          }
          
          .primary-actions {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .secondary-actions {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <div 
        className="quick-actions-header"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="header-content">
          <div className="header-icon">
            <Zap className="w-5 h-5" />
          </div>
          <div className="header-text">
            <h3>Quick Actions</h3>
            <p>Access tools and features quickly</p>
          </div>
        </div>
        
        <div className={`toggle-btn ${expanded ? 'expanded' : ''}`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      <div className="quick-actions-content">
        {/* Primary Actions */}
        <div className="section">
          <div className="section-title">
            <Zap className="w-4 h-4" />
            <span>Most Used</span>
          </div>
          
          <div className="primary-actions">
            {primaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className="primary-action"
                  onClick={() => handleAction(action)}
                >
                  <div className="action-icon" style={{ background: action.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="action-label">{action.label}</div>
                  <div className="action-description">{action.description}</div>
                  <div className="shortcut">{action.shortcut}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="section">
          <div className="section-title">
            <MoreVertical className="w-4 h-4" />
            <span>More Actions</span>
          </div>
          
          <div className="secondary-actions">
            {secondaryActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  className="secondary-action"
                  onClick={() => handleAction(action)}
                >
                  <div className="secondary-icon" style={{ background: action.color }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="secondary-label">{action.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="section">
          <div className="section-title">
            <TrendingUp className="w-4 h-4" />
            <span>Quick Stats</span>
          </div>
          
          <div className="stats-grid">
            {quickStats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-change">{stat.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Actions */}
        <div className="section">
          <div className="section-title">
            <Clock className="w-4 h-4" />
            <span>Recent Actions</span>
          </div>
          
          <div className="recent-actions">
            {recentActions.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.id} className="recent-action">
                  <div className="recent-icon">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="recent-content">
                    <div className="recent-label">{action.label}</div>
                    <div className="recent-time">{action.time}</div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={() => removeRecentAction(action.id)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="footer">
            <button className="customize-btn">
              <Settings className="w-3 h-3" />
              Customize
            </button>
            
            <button className="all-actions-btn">
              View All Actions
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}