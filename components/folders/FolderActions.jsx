import { useState } from "react";
import {
  MoreVertical,
  Edit,
  Archive,
  Trash2,
  Copy,
  Move,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Download,
  Share2,
} from "lucide-react";
 import"@styles/components/folders/FolderActions.module.css";
export default function FolderActions({
  folder,
  onEdit,
  onArchive,
  onDelete,
  onDuplicate,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    {
      icon: Edit,
      label: "Edit Folder",
      onClick: () => onEdit(folder),
      color: "text-blue-600",
    },
    {
      icon: Copy,
      label: "Duplicate",
      onClick: onDuplicate,
      color: "text-purple-600",
    },
    {
      icon: Move,
      label: "Move",
      onClick: () => console.log("Move folder"),
      color: "text-green-600",
    },
    {
      icon: folder.isArchived ? Eye : EyeOff,
      label: folder.isArchived ? "Unarchive" : "Archive",
      onClick: onArchive,
      color: "text-amber-600",
    },
    {
      icon: folder.isProtected ? Unlock : Lock,
      label: folder.isProtected ? "Unprotect" : "Protect",
      onClick: () => onEdit({ isProtected: !folder.isProtected }),
      color: "text-red-600",
    },
    {
      icon: Download,
      label: "Export",
      onClick: () => console.log("Export folder"),
      color: "text-indigo-600",
    },
    {
      icon: Share2,
      label: "Share",
      onClick: () => console.log("Share folder"),
      color: "text-teal-600",
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: onDelete,
      color: "text-red-600",
      danger: true,
    },
  ];

  return (
    <div className="folder-actions-container">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="actions-toggle"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {showMenu && (
        <>
          <div
            className="backdrop"
            onClick={() => setShowMenu(false)}
          />
          <div className="actions-menu">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setShowMenu(false);
                  }}
                  className={`menu-item ${item.danger ? "danger" : ""}`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}