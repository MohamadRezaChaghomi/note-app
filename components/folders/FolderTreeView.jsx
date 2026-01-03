"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FileText, MoreVertical } from "lucide-react";
import "@styles/components/folders/FolderTreeView.module.css";
export default function FolderTreeView({ folders, onFolderClick, onEditFolder, onDeleteFolder }) {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const renderFolder = (folder, depth = 0) => {
    const hasSubfolders = folder.subfolders && folder.subfolders.length > 0;
    const isExpanded = expandedFolders[folder._id];

    return (
      <div key={folder._id} className="tree-folder">
        <div
          className="tree-folder-row"
          style={{ paddingLeft: `${depth * 1.5}rem` }}
          onClick={() => onFolderClick(folder)}
        >
          <div className="folder-expand-toggle">
            {hasSubfolders ? (
              <button
                className="expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder._id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            ) : (
              <div className="expand-placeholder" />
            )}
          </div>

          <div className="folder-icon-wrapper">
            <div
              className="tree-folder-icon"
              style={{ backgroundColor: folder.color }}
            >
              <Folder className="w-4 h-4" />
            </div>
          </div>

          <div className="folder-info">
            <span className="folder-title">{folder.title}</span>
            {folder.description && (
              <span className="folder-description">{folder.description}</span>
            )}
          </div>

          <div className="folder-stats">
            {folder.noteCount > 0 && (
              <span className="note-count">
                <FileText className="w-3 h-3" />
                {folder.noteCount}
              </span>
            )}
          </div>

          <div className="folder-actions">
            <button
              className="tree-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEditFolder(folder);
              }}
            >
              Edit
            </button>
            <button
              className="tree-action-btn danger"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFolder(folder);
              }}
            >
              Delete
            </button>
          </div>
        </div>

        {hasSubfolders && isExpanded && (
          <div className="tree-subfolders">
            {folder.subfolders.map(subfolder => renderFolder(subfolder, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="folder-tree-view">
      <div className="tree-header">
        <div className="tree-col name">Name</div>
        <div className="tree-col stats">Notes</div>
        <div className="tree-col actions">Actions</div>
      </div>
      
      <div className="tree-body">
        {folders.map(folder => renderFolder(folder))}
      </div>
    </div>
  );
}