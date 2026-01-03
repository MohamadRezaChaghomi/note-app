import { Calendar, Edit, Folder, Lock, Unlock, User } from "lucide-react";
import "@styles/components/folders/FolderInfoCard.module.css";
export default function FolderInfoCard({ folder, stats }) {
  return (
    <div className="folder-info-card">
      <div className="info-header">
        <div
          className="info-icon"
          style={{ backgroundColor: folder.color }}
        >
          <Folder className="w-5 h-5" />
        </div>
        <div className="info-title">
          <h3>{folder.title}</h3>
          <span className="info-status">
            {folder.isProtected ? "Protected" : "Standard"}
          </span>
        </div>
      </div>

      <div className="info-section">
        <h4>Description</h4>
        <p className="info-description">
          {folder.description || "No description provided"}
        </p>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <Calendar className="w-4 h-4" />
          <div>
            <span className="info-label">Created</span>
            <span className="info-value">
              {new Date(folder.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="info-item">
          <Edit className="w-4 h-4" />
          <div>
            <span className="info-label">Last Updated</span>
            <span className="info-value">
              {new Date(folder.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="info-item">
          <Folder className="w-4 h-4" />
          <div>
            <span className="info-label">Type</span>
            <span className="info-value">
              {folder.isDefault ? "Default Folder" : "Custom Folder"}
            </span>
          </div>
        </div>

        <div className="info-item">
          {folder.isProtected ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Unlock className="w-4 h-4" />
          )}
          <div>
            <span className="info-label">Protection</span>
            <span className="info-value">
              {folder.isProtected ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      {stats && (
        <div className="info-stats">
          <h4>Statistics</h4>
          <div className="stats-bars">
            <div className="stat-bar">
              <div className="stat-label">Notes</div>
              <div className="stat-value">{stats.totalNotes || 0}</div>
            </div>
            <div className="stat-bar">
              <div className="stat-label">Subfolders</div>
              <div className="stat-value">{stats.subfoldersCount || 0}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}