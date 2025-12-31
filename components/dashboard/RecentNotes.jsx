// components/dashboard/RecentNotes.jsx
"use client";

import { useState } from "react";
import { 
  FileText, Star, Eye, Download, Clock, 
  MoreVertical, Tag 
} from "lucide-react";
import Link from "next/link";

export default function RecentNotes({ notes = [] }) {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Sample data if none provided
  const sampleNotes = [
    {
      id: 1,
      title: "Meeting Notes",
      content: "Discussed project timeline and deliverables...",
      date: "2 hours ago",
      tags: ["Work", "Meeting"],
      starred: true,
      views: 24,
      downloads: 5
    },
    {
      id: 2,
      title: "Personal Goals",
      content: "Q1 objectives and personal development plan",
      date: "Yesterday",
      tags: ["Personal"],
      starred: false,
      views: 12,
      downloads: 2
    },
    {
      id: 3,
      title: "Research Ideas",
      content: "Notes from AI research paper reading",
      date: "2 days ago",
      tags: ["Research", "AI"],
      starred: true,
      views: 45,
      downloads: 8
    },
    {
      id: 4,
      title: "Shopping List",
      content: "Weekly groceries and household items",
      date: "3 days ago",
      tags: ["Personal"],
      starred: false,
      views: 8,
      downloads: 1
    }
  ];

  const displayNotes = notes.length > 0 ? notes : sampleNotes;

  return (
    <div className="recent-notes">
      <style jsx>{`
        .recent-notes {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .note-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.75rem;
          transition: background-color 0.2s;
          position: relative;
        }
        
        .note-item:hover {
          background: #f3f4f6;
        }
        
        .note-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          background: white;
          color: #667eea;
          flex-shrink: 0;
        }
        
        .note-content {
          flex: 1;
          min-width: 0;
        }
        
        .note-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .note-preview {
          font-size: 0.75rem;
          color: #6b7280;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.5rem;
        }
        
        .note-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }
        
        .note-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .note-tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: #e5e7eb;
          padding: 0.125rem 0.5rem;
          border-radius: 0.375rem;
        }
        
        .note-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        
        .note-action-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.75rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .note-action-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }
        
        .note-star {
          color: #f59e0b;
        }
        
        .note-menu-btn {
          padding: 0.375rem;
          background: transparent;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          color: #9ca3af;
          transition: color 0.2s;
        }
        
        .note-menu-btn:hover {
          color: #374151;
          background: #f3f4f6;
        }
        
        .note-menu {
          position: absolute;
          right: 0.5rem;
          top: 2.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 10;
          min-width: 150px;
        }
        
        .menu-item {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .menu-item:hover {
          background: #f9fafb;
        }
        
        .no-notes {
          text-align: center;
          padding: 2rem;
          color: #9ca3af;
        }
        
        .no-notes svg {
          margin-bottom: 0.5rem;
        }
      `}</style>

      {displayNotes.length > 0 ? (
        displayNotes.map((note) => (
          <div key={note.id} className="note-item">
            <div className="note-icon">
              <FileText className="w-5 h-5" />
            </div>
            
            <div className="note-content">
              <div className="note-title">
                <Link href={`/dashboard/notes/${note.id}`}>
                  {note.title}
                </Link>
                {note.starred && <Star className="w-4 h-4 note-star" />}
              </div>
              
              <div className="note-preview">
                {note.content}
              </div>
              
              <div className="note-meta">
                <div className="note-date">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {note.date}
                </div>
                
                {note.tags && note.tags.length > 0 && (
                  <div className="note-tags">
                    {note.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="note-tag">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="note-tag">+{note.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="note-actions">
              <div className="note-action-btn">
                <Eye className="w-3 h-3" />
                {note.views}
              </div>
              
              <div className="note-action-btn">
                <Download className="w-3 h-3" />
                {note.downloads}
              </div>
              
              <button 
                className="note-menu-btn"
                onClick={() => toggleMenu(note.id)}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {activeMenu === note.id && (
                <div className="note-menu">
                  <div className="menu-item">Edit</div>
                  <div className="menu-item">Duplicate</div>
                  <div className="menu-item">Share</div>
                  <div className="menu-item">Delete</div>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="no-notes">
          <FileText className="w-12 h-12 mx-auto" />
          <p>No recent notes found</p>
        </div>
      )}
    </div>
  );
}