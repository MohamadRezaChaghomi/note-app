"use client";

import { useState } from "react";
import {
  Archive,
  Trash2,
  Move,
  Copy,
  Download,
  Share2,
  X,
  ChevronDown,
} from "lucide-react";
import "@styles/components/folders/BulkFolderActions.module.css";
export default function BulkFolderActions({
  count,
  onArchive,
  onUnarchive,
  onMove,
  onDelete,
  onDuplicate,
  onExport,
  onShare,
  onCancel,
}) {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const actions = [
    {
      id: "archive",
      label: "Archive",
      icon: Archive,
      onClick: onArchive,
      color: "text-amber-600",
    },
    {
      id: "unarchive",
      label: "Unarchive",
      icon: Archive,
      onClick: onUnarchive,
      color: "text-green-600",
    },
    {
      id: "move",
      label: "Move to...",
      icon: Move,
      onClick: () => setShowMoveMenu(true),
      color: "text-blue-600",
    },
    {
      id: "duplicate",
      label: "Duplicate",
      icon: Copy,
      onClick: onDuplicate,
      color: "text-purple-600",
    },
    {
      id: "export",
      label: "Export",
      icon: Download,
      onClick: onExport,
      color: "text-indigo-600",
    },
    {
      id: "share",
      label: "Share",
      icon: Share2,
      onClick: onShare,
      color: "text-teal-600",
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
      color: "text-red-600",
      danger: true,
    },
  ];

  return (
    <div className="bulk-actions-container">
      <div className="bulk-header">
        <div className="selected-count">
          <span className="count-number">{count}</span>
          <span className="count-label">selected</span>
        </div>
        
        <div className="actions-buttons">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                className={`action-btn ${action.danger ? "danger" : ""}`}
                onClick={() => {
                  setSelectedAction(action.id);
                  if (action.onClick) action.onClick();
                }}
                disabled={!action.onClick}
              >
                <Icon className={`w-4 h-4 ${action.color}`} />
                <span>{action.label}</span>
              </button>
            );
          })}
          
          <button className="cancel-btn" onClick={onCancel}>
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {showMoveMenu && (
        <div className="move-dialog">
          <div className="move-dialog-header">
            <h4>Move Selected Folders</h4>
            <button
              className="close-btn"
              onClick={() => setShowMoveMenu(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="move-dialog-content">
            <p>Select destination folder:</p>
            {/* در اینجا می‌توانید لیست فولدرها را برای انتخاب نمایش دهید */}
            <div className="folder-picker">
              {/* پیاده‌سازی انتخاب فولدر مقصد */}
            </div>
          </div>
          
          <div className="move-dialog-actions">
            <button
              className="secondary-btn"
              onClick={() => setShowMoveMenu(false)}
            >
              Cancel
            </button>
            <button
              className="primary-btn"
              onClick={() => {
                // فراخوانی تابع move با فولدر انتخاب شده
                setShowMoveMenu(false);
              }}
            >
              Move Here
            </button>
          </div>
        </div>
      )}
    </div>
  );
}