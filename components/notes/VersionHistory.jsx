"use client";

import { useState, useEffect } from "react";
import { 
  Clock, User, RefreshCw, Download, 
  Eye, Check, X, Calendar, FileText 
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import "@styles/components/notes/version-history.module.css"

export default function VersionHistory({ noteId, onClose, onRestoreVersion }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    loadVersions();
  }, [noteId]);

  const loadVersions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/notes/${noteId}/versions`);
      const data = await res.json();
      
      if (data.ok && data.versions) {
        setVersions(data.versions);
        if (data.versions.length > 0) {
          setSelectedVersion(data.versions[0]);
          setPreview(data.versions[0].content || data.versions[0].description || "");
        }
      }
    } catch (error) {
      console.error("Failed to load versions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
    setPreview(version.content || version.description || "");
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;
    
    if (confirm("Are you sure you want to restore this version? Current content will be replaced.")) {
      await onRestoreVersion(selectedVersion._id);
      onClose();
    }
  };

  const downloadVersion = (version) => {
    const blob = new Blob([version.content || version.description || ""], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `note-version-${version.version}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="version-history">
        <div className="loading">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
          <p>Loading version history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="version-history">
      <div className="history-header">
        <h3>Version History</h3>
        <button onClick={onClose} className="close-btn">
          <X className="w-5 h-5" />
        </button>
      </div>

      {versions.length === 0 ? (
        <div className="empty-versions">
          <FileText className="w-12 h-12 text-gray-400" />
          <p>No version history available</p>
        </div>
      ) : (
        <div className="history-content">
          {/* Sidebar - Version List */}
          <div className="version-list">
            <h4>Versions</h4>
            <div className="versions">
              {versions.map((version) => (
                <div
                  key={version._id}
                  className={`version-item ${selectedVersion?._id === version._id ? 'selected' : ''}`}
                  onClick={() => handleVersionSelect(version)}
                >
                  <div className="version-info">
                    <div className="version-header">
                      <span className="version-number">Version {version.version}</span>
                      {version.isCurrent && (
                        <span className="current-badge">Current</span>
                      )}
                    </div>
                    <div className="version-meta">
                      <span className="meta-item">
                        <Calendar className="w-3 h-3" />
                        {formatDate(version.createdAt)}
                      </span>
                      <span className="meta-item">
                        <User className="w-3 h-3" />
                        {version.editor || "System"}
                      </span>
                    </div>
                  </div>
                  <div className="version-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadVersion(version);
                      }}
                      className="action-btn"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main - Preview */}
          <div className="version-preview">
            <div className="preview-header">
              <h4>
                Preview - Version {selectedVersion?.version}
                {selectedVersion?.isCurrent && (
                  <span className="current-badge">Current</span>
                )}
              </h4>
              <div className="preview-actions">
                <button
                  onClick={() => {
                    const element = document.querySelector('.preview-content');
                    if (element) {
                      element.classList.toggle('show-diff');
                    }
                  }}
                  className="action-btn"
                >
                  <Eye className="w-4 h-4" />
                  Show Changes
                </button>
                <button
                  onClick={handleRestore}
                  className="restore-btn"
                >
                  <Check className="w-4 h-4" />
                  Restore This Version
                </button>
              </div>
            </div>

            <div className="preview-info">
              <div className="info-item">
                <Calendar className="w-4 h-4" />
                <span>Created: {selectedVersion && formatDate(selectedVersion.createdAt)}</span>
              </div>
              <div className="info-item">
                <User className="w-4 h-4" />
                <span>Edited by: {selectedVersion?.editor || "System"}</span>
              </div>
              <div className="info-item">
                <FileText className="w-4 h-4" />
                <span>Characters: {preview.length}</span>
              </div>
            </div>

            <div className="preview-content">
              {preview ? (
                <div dangerouslySetInnerHTML={{ __html: preview }} />
              ) : (
                <p className="empty-preview">No content in this version</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}