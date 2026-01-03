"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Folder,
  FolderOpen,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Copy,
  Star,
  Lock,
  ChevronRight,
  FileText,
} from "lucide-react";
import "@styles/components/folders/FolderCard.module.css";
export default function FolderCard({ folder, onEdit, onDelete, selected, onSelect, bulkMode }) {
  const [showActions, setShowActions] = useState(false);
  
  const getIcon = (iconName) => {
    const icons = {
      folder: Folder,
      archive: Archive,
      trash: Trash2,
      star: Star,
      work: Folder,
      personal: Folder,
      ideas: Folder,
      projects: Folder,
    };
    return icons[iconName] || Folder;
  };

  const Icon = getIcon(folder.icon);

  return (
    <div className={`folder-card ${selected ? "selected" : ""} ${bulkMode ? "bulk-mode" : ""}`}>
      {bulkMode && (
        <div className="bulk-select-overlay">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(folder._id);
            }}
            className="bulk-checkbox"
          />
        </div>
      )}
      
      <div className="card-header">
        <div
          className="folder-icon"
          style={{ backgroundColor: folder.color }}
        >
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="folder-badge-group">
          {folder.isProtected && (
            <span className="badge protected" title="Protected folder">
              <Lock className="w-3 h-3" />
            </span>
          )}
          {folder.isArchived && (
            <span className="badge archived" title="Archived folder">
              <Archive className="w-3 h-3" />
            </span>
          )}
          {folder.isDefault && (
            <span className="badge default" title="Default folder">
              <Star className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>

      <div className="card-content">
        <h3 className="folder-title">{folder.title}</h3>
        
        {folder.description && (
          <p className="folder-description">{folder.description}</p>
        )}
        
        <div className="folder-meta">
          <span className="meta-item">
            <FileText className="w-3 h-3" />
            {folder.noteCount || 0} notes
          </span>
          
          {folder.subfolders && folder.subfolders.length > 0 && (
            <span className="meta-item">
              <FolderOpen className="w-3 h-3" />
              {folder.subfolders.length} subfolders
            </span>
          )}
          
          <span className="meta-item">
            Updated {new Date(folder.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="card-actions">
        <button
          className="action-btn more-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        
        {showActions && (
          <div className="actions-dropdown">
            <button
              className="dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(folder);
                setShowActions(false);
              }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            
            <button
              className="dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                // Handle duplicate
                setShowActions(false);
              }}
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>
            
            <button
              className="dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                // Handle archive
                setShowActions(false);
              }}
            >
              <Archive className="w-4 h-4" />
              {folder.isArchived ? "Unarchive" : "Archive"}
            </button>
            
            <hr className="dropdown-divider" />
            
            <button
              className="dropdown-item danger"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(folder);
                setShowActions(false);
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      <Link href={`/folders/${folder._id}`} className="card-link">
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
}