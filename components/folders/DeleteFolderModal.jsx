"use client";

import { useState } from "react";
import {
  X,
  Trash2,
  AlertTriangle,
  Folder,
  FileText,
  Archive,
  Move,
  ChevronDown,
} from "lucide-react";
import "@styles/components/folders/DeleteFolderModal.module.css";
export default function DeleteFolderModal({ folder, onClose, onSubmit, folders }) {
  const [loading, setLoading] = useState(false);
  const [deleteOption, setDeleteOption] = useState("archive");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [confirmText, setConfirmText] = useState("");

  const noteCount = folder.noteCount || 0;
  const subfolderCount = folder.subfolders?.length || 0;

  const deleteOptions = [
    {
      id: "archive",
      label: "Move to Archive",
      description: "Folder will be moved to archive and can be restored later.",
      icon: Archive,
      color: "text-amber-600",
    },
    {
      id: "moveNotes",
      label: "Move Notes to Another Folder",
      description: "Delete folder but move all notes to another folder.",
      icon: Move,
      color: "text-blue-600",
    },
    {
      id: "permanent",
      label: "Permanently Delete",
      description: "Folder and all its contents will be permanently deleted. This action cannot be undone.",
      icon: Trash2,
      color: "text-red-600",
      dangerous: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (deleteOption === "permanent" && confirmText !== folder.title) {
      alert(`Please type "${folder.title}" to confirm permanent deletion.`);
      return;
    }

    setLoading(true);
    try {
      const options = {};
      
      switch (deleteOption) {
        case "archive":
          options.force = false;
          break;
        case "moveNotes":
          if (!selectedFolder) {
            alert("Please select a folder to move notes to.");
            return;
          }
          options.force = false;
          options.moveNotesTo = selectedFolder;
          break;
        case "permanent":
          options.force = true;
          break;
      }

      await onSubmit(folder._id, options);
    } finally {
      setLoading(false);
    }
  };

  const getFolderName = (folderId) => {
    const found = folders?.find(f => f._id === folderId);
    return found ? found.title : "Select folder";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container delete-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2>Delete Folder</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="modal-content">
          <div className="warning-section">
            <div className="warning-icon">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="warning-content">
              <h3>Are you sure you want to delete "{folder.title}"?</h3>
              <p>This folder contains:</p>
              <div className="folder-contents">
                <div className="content-item">
                  <FileText className="w-4 h-4" />
                  <span>{noteCount} note{noteCount !== 1 ? "s" : ""}</span>
                </div>
                {subfolderCount > 0 && (
                  <div className="content-item">
                    <Folder className="w-4 h-4" />
                    <span>{subfolderCount} subfolder{subfolderCount !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="delete-form">
            <div className="form-section">
              <h4>Select deletion method:</h4>
              
              <div className="delete-options">
                {deleteOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.id}
                      className={`delete-option ${deleteOption === option.id ? "selected" : ""} ${option.dangerous ? "dangerous" : ""}`}
                    >
                      <input
                        type="radio"
                        name="deleteOption"
                        value={option.id}
                        checked={deleteOption === option.id}
                        onChange={(e) => setDeleteOption(e.target.value)}
                        className="option-input"
                      />
                      <div className="option-content">
                        <div className="option-header">
                          <Icon className={`w-5 h-5 ${option.color}`} />
                          <span className="option-label">{option.label}</span>
                        </div>
                        <p className="option-description">{option.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {deleteOption === "moveNotes" && folders && folders.length > 0 && (
              <div className="form-section">
                <label className="form-label">
                  Move notes to:
                </label>
                <div className="folder-select">
                  <select
                    value={selectedFolder || ""}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="select-input"
                    required={deleteOption === "moveNotes"}
                  >
                    <option value="">Select a folder</option>
                    {folders
                      .filter(f => f._id !== folder._id)
                      .map(f => (
                        <option key={f._id} value={f._id}>
                          {f.title} ({f.noteCount || 0} notes)
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="select-icon" />
                </div>
              </div>
            )}

            {deleteOption === "permanent" && (
              <div className="form-section">
                <label className="form-label">
                  Type "<span className="folder-name-confirm">{folder.title}</span>" to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={`Type "${folder.title}"`}
                  className="confirm-input"
                  required={deleteOption === "permanent"}
                />
                <div className="form-hint">
                  This action cannot be undone. All notes and subfolders will be permanently deleted.
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="secondary-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`primary-btn ${deleteOption === "permanent" ? "danger" : ""}`}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
                {loading ? "Processing..." : 
                  deleteOption === "archive" ? "Move to Archive" :
                  deleteOption === "moveNotes" ? "Move Notes & Delete" :
                  "Permanently Delete"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}