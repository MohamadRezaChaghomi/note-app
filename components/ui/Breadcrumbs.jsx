// components/ui/Breadcrumbs.jsx
"use client";

import { useState } from "react";
import { ChevronRight, Home, Folder, FileText, Users, Settings } from "lucide-react";
import Link from "next/link";

const iconMap = {
  home: Home,
  folder: Folder,
  notes: FileText,
  team: Users,
  settings: Settings
};

export default function Breadcrumbs({ 
  items = [], 
  separator = "chevron",
  className = "",
  onNavigate = null 
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const Separator = separator === "chevron" ? ChevronRight : (
    separator === "slash" ? "/" : ">"
  );

  const handleItemClick = (item, index) => {
    if (onNavigate && index < items.length - 1) {
      onNavigate(item, index);
    }
  };

  // Default items if none provided
  const defaultItems = [
    { label: "Home", href: "/dashboard", icon: "home" },
    { label: "Notes", href: "/dashboard/notes", icon: "notes" },
    { label: "Recent", href: "#" }
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <div className={`breadcrumbs ${className}`}>
      <style jsx>{`
        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 0;
          flex-wrap: wrap;
        }
        
        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        
        .breadcrumb-link {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #6b7280;
          font-size: 0.875rem;
          text-decoration: none;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s;
        }
        
        .breadcrumb-link:hover {
          color: #374151;
          background: #f3f4f6;
        }
        
        .breadcrumb-link.active {
          color: #1f2937;
          font-weight: 600;
          cursor: default;
        }
        
        .breadcrumb-link.active:hover {
          background: transparent;
        }
        
        .breadcrumb-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1rem;
          height: 1rem;
        }
        
        .breadcrumb-separator {
          color: #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
        }
        
        .breadcrumb-dropdown {
          position: relative;
        }
        
        .breadcrumb-dropdown-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .breadcrumb-dropdown-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .breadcrumb-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 50;
          margin-top: 0.25rem;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          color: #374151;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        
        .dropdown-item:hover {
          background: #f9fafb;
        }
        
        .breadcrumb-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-left: auto;
        }
        
        .action-btn {
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
        
        .action-btn:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
        }
        
        .mobile-view {
          display: none;
        }
        
        @media (max-width: 640px) {
          .desktop-view {
            display: none;
          }
          
          .mobile-view {
            display: flex;
            width: 100%;
          }
          
          .mobile-breadcrumb {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 0.5rem;
            background: #f9fafb;
            border-radius: 0.5rem;
          }
          
          .mobile-current {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            color: #1f2937;
          }
          
          .mobile-back-btn {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            color: #6b7280;
            font-size: 0.875rem;
            text-decoration: none;
          }
        }
        
        .compact .breadcrumb-item {
          gap: 0.25rem;
        }
        
        .compact .breadcrumb-link {
          padding: 0.125rem 0.25rem;
          font-size: 0.75rem;
        }
      `}</style>

      <div className="desktop-view">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const Icon = item.icon ? iconMap[item.icon] : null;
          
          return (
            <div key={index} className="breadcrumb-item">
              {index > 0 && (
                <span className="breadcrumb-separator">
                  {typeof Separator === "function" ? <Separator className="w-4 h-4" /> : Separator}
                </span>
              )}
              
              {isLast ? (
                <span 
                  className={`breadcrumb-link active ${hoveredItem === index ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {Icon && (
                    <span className="breadcrumb-icon">
                      <Icon className="w-4 h-4" />
                    </span>
                  )}
                  <span>{item.label}</span>
                  
                  {item.badge && (
                    <span className="badge">
                      {item.badge}
                    </span>
                  )}
                </span>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={`breadcrumb-link ${hoveredItem === index ? 'hovered' : ''}`}
                  onClick={() => handleItemClick(item, index)}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {Icon && (
                    <span className="breadcrumb-icon">
                      <Icon className="w-4 h-4" />
                    </span>
                  )}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>
          );
        })}
        
        {/* Show breadcrumb actions if any */}
        {displayItems.length > 2 && (
          <div className="breadcrumb-dropdown">
            <button className="breadcrumb-dropdown-btn">
              <ChevronRight className="w-3 h-3 rotate-90" />
              More
            </button>
          </div>
        )}
        
        <div className="breadcrumb-actions">
          <button className="action-btn">
            <ChevronRight className="w-3 h-3 rotate-180" />
            Back
          </button>
          <button className="action-btn">
            Refresh
          </button>
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="mobile-view">
        <div className="mobile-breadcrumb">
          {displayItems.length > 1 && (
            <Link 
              href={displayItems[displayItems.length - 2].href || "#"}
              className="mobile-back-btn"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back
            </Link>
          )}
          
          <div className="mobile-current">
            {(() => {
              const currentItem = displayItems[displayItems.length - 1];
              const Icon = currentItem.icon ? iconMap[currentItem.icon] : null;
              return (
                <>
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{currentItem.label}</span>
                </>
              );
            })()}
          </div>
          
          <button className="action-btn">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}