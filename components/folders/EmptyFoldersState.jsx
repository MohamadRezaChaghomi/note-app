import {
  Folder,
  FolderPlus,
  ArrowLeft,
  Search,
  Upload,
  BookOpen,
} from "lucide-react";
import "@styles/components/folders/EmptyFoldersState.module.css";
export default function EmptyFoldersState({
  parentFolder,
  onCreateFolder,
  onGoBack,
  onImport,
}) {
  return (
    <div className="empty-folders-state">
      <div className="empty-illustration">
        <div className="illustration-circle">
          <Folder className="w-16 h-16 text-gray-400" />
        </div>
      </div>
      
      <div className="empty-content">
        <h2>No folders here yet</h2>
        
        <p className="empty-description">
          {parentFolder
            ? "This folder doesn't have any subfolders yet. Create one to start organizing your notes."
            : "You haven't created any folders yet. Create your first folder to start organizing your notes."}
        </p>
        
        <div className="empty-actions">
          <button
            onClick={onCreateFolder}
            className="primary-action-btn"
          >
            <FolderPlus className="w-5 h-5" />
            Create New Folder
          </button>
          
          {onImport && (
            <button
              onClick={onImport}
              className="secondary-action-btn"
            >
              <Upload className="w-5 h-5" />
              Import Folders
            </button>
          )}
          
          {parentFolder && (
            <button
              onClick={onGoBack}
              className="tertiary-action-btn"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          )}
        </div>
        
        <div className="empty-tips">
          <h4>Tips for getting started:</h4>
          <ul className="tips-list">
            <li>
              <Folder className="w-4 h-4" />
              Create folders for different projects or topics
            </li>
            <li>
              <Search className="w-4 h-4" />
              Use descriptive names for easy searching
            </li>
            <li>
              <BookOpen className="w-4 h-4" />
              Organize notes into logical categories
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}