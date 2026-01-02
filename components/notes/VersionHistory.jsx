"use client";

import { X } from "lucide-react";
import "@/styles/components/notes.css";
export default function VersionHistory({ versions = [], onClose, onRestoreVersion }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Version History</h2>
          <button onClick={onClose} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body">
          {versions.length === 0 ? (
            <p className="text-center text-gray-500">No version history available</p>
          ) : (
            <div className="versions-list">
              {versions.map((version, index) => (
                <div key={index} className="version-item">
                  <div className="version-info">
                    <p className="version-date">
                      {new Date(version.createdAt).toLocaleString()}
                    </p>
                    <p className="version-preview">{version.title || 'Untitled'}</p>
                  </div>
                  <button
                    onClick={() => onRestoreVersion(version._id)}
                    className="version-restore-btn"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
