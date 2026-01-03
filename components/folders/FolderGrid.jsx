"use client";

import FolderCard from "./FolderCard";
import "@styles/components/folders/FolderGrid.module.css";
export default function FolderGrid({
  folders,
  selectedFolders,
  bulkMode,
  onSelectFolder,
  onFolderClick,
  onEditFolder,
  onDeleteFolder,
}) {
  const handleSelectFolder = (folderId) => {
    if (selectedFolders.includes(folderId)) {
      onSelectFolder(selectedFolders.filter(id => id !== folderId));
    } else {
      onSelectFolder([...selectedFolders, folderId]);
    }
  };

  const handleFolderClick = (folder) => {
    if (bulkMode) {
      handleSelectFolder(folder._id);
    } else {
      onFolderClick(folder);
    }
  };

  return (
    <div className="folders-grid">
      {folders.map((folder) => (
        <div
          key={folder._id}
          className="grid-item"
          onClick={() => handleFolderClick(folder)}
        >
          <FolderCard
            folder={folder}
            selected={selectedFolders.includes(folder._id)}
            bulkMode={bulkMode}
            onSelect={handleSelectFolder}
            onEdit={onEditFolder}
            onDelete={onDeleteFolder}
          />
        </div>
      ))}
    </div>
  );
}