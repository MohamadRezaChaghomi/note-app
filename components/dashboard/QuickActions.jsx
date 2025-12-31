// components/dashboard/QuickActions.jsx
"use client";

import { 
  Plus, Upload, FolderPlus, 
  Search, Share2, Settings,
  FileText, Users, Bell 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      id: 1,
      title: "New Note",
      icon: Plus,
      color: "bg-blue-100 text-blue-600",
      description: "Create a new note",
      action: () => router.push("/dashboard/notes/new")
    },
    {
      id: 2,
      title: "Import Notes",
      icon: Upload,
      color: "bg-green-100 text-green-600",
      description: "Import from file",
      action: () => router.push("/dashboard/import")
    },
    {
      id: 3,
      title: "New Folder",
      icon: FolderPlus,
      color: "bg-purple-100 text-purple-600",
      description: "Organize notes",
      action: () => router.push("/dashboard/folders/new")
    },
    {
      id: 4,
      title: "Search",
      icon: Search,
      color: "bg-yellow-100 text-yellow-600",
      description: "Find notes quickly",
      action: () => router.push("/dashboard/search")
    },
    {
      id: 5,
      title: "Share",
      icon: Share2,
      color: "bg-pink-100 text-pink-600",
      description: "Share with others",
      action: () => router.push("/dashboard/share")
    },
    {
      id: 6,
      title: "Templates",
      icon: FileText,
      color: "bg-indigo-100 text-indigo-600",
      description: "Use templates",
      action: () => router.push("/dashboard/templates")
    },
    {
      id: 7,
      title: "Collaborate",
      icon: Users,
      color: "bg-cyan-100 text-cyan-600",
      description: "Team workspace",
      action: () => router.push("/dashboard/team")
    },
    {
      id: 8,
      title: "Settings",
      icon: Settings,
      color: "bg-gray-100 text-gray-600",
      description: "Customize app",
      action: () => router.push("/dashboard/settings")
    }
  ];

  return (
    <div className="quick-actions">
      <style jsx>{`
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        
        @media (min-width: 640px) {
          .quick-actions {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          min-height: 100px;
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }
        
        .action-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          margin-bottom: 0.5rem;
        }
        
        .action-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }
        
        .action-description {
          font-size: 0.75rem;
          color: #6b7280;
          line-height: 1.2;
        }
        
        .notifications {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #fef3c7;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .notifications-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          background: #fbbf24;
          color: white;
          flex-shrink: 0;
        }
        
        .notifications-content h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 0.25rem;
        }
        
        .notifications-content p {
          font-size: 0.75rem;
          color: #92400e;
          opacity: 0.8;
        }
      `}</style>

      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            className="action-btn"
            onClick={action.action}
          >
            <div className={`action-icon ${action.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="action-title">{action.title}</div>
            <div className="action-description">{action.description}</div>
          </button>
        );
      })}
      
      <div className="notifications">
        <div className="notifications-icon">
          <Bell className="w-5 h-5" />
        </div>
        <div className="notifications-content">
          <h4>2 New Features</h4>
          <p>Try out our latest updates</p>
        </div>
      </div>
    </div>
  );
}