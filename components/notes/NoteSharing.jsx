"use client";

import { useState, useEffect } from "react";
import { 
  X, Link as LinkIcon, Copy, Check, Mail, 
  Users, Lock, Globe, UserPlus, UserMinus,
  Edit, Eye, Send, Search, MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import "@styles/components/notes/note-sharing.module.css";

export default function NoteSharing({ note, onClose, onUpdate }) {
  const [copied, setCopied] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [permission, setPermission] = useState("view");
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    // Load users to share with
    loadUsers();
    generateShareLink();
  }, [note]);

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const token = btoa(JSON.stringify({
      noteId: note._id,
      expires: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    }));
    setShareLink(`${baseUrl}/shared/${token}`);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareWithUser = async (userId) => {
    try {
      setLoading(true);
      
      const res = await fetch(`/api/notes/${note._id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          permission
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to share note");
      }

      toast.success("Note shared successfully");
      onUpdate?.();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to share note");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShare = async (userId) => {
    try {
      const res = await fetch(`/api/notes/${note._id}/share/${userId}`, {
        method: "DELETE"
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to remove share");
      }

      toast.success("Share removed successfully");
      onUpdate?.();
    } catch (error) {
      toast.error(error.message || "Failed to remove share");
    }
  };

  const handleUpdatePermission = async (userId, newPermission) => {
    try {
      const res = await fetch(`/api/notes/${note._id}/share/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission: newPermission })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to update permission");
      }

      toast.success("Permission updated successfully");
      onUpdate?.();
    } catch (error) {
      toast.error(error.message || "Failed to update permission");
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sharedWith = note.sharedWith || [];

  return (
    <div className="note-sharing">
      <div className="sharing-header">
        <h3>Share Note</h3>
        <button onClick={onClose} className="close-btn">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="sharing-content">
        {/* Share Link Section */}
        <div className="share-link-section">
          <h4>
            <LinkIcon className="w-4 h-4" />
            Shareable Link
          </h4>
          <div className="link-container">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="link-input"
            />
            <button onClick={copyShareLink} className="copy-btn">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="link-info">
            Anyone with this link can {note.isPublic ? "view" : "edit"} this note.
            Link expires in 30 days.
          </p>
        </div>

        {/* Share With Users */}
        <div className="share-users-section">
          <h4>
            <Users className="w-4 h-4" />
            Share with People
          </h4>
          
          {/* Permission Selector */}
          <div className="permission-selector">
            <label>Permission:</label>
            <div className="permission-options">
              <button
                onClick={() => setPermission("view")}
                className={`permission-btn ${permission === "view" ? "active" : ""}`}
              >
                <Eye className="w-4 h-4" />
                View Only
              </button>
              <button
                onClick={() => setPermission("edit")}
                className={`permission-btn ${permission === "edit" ? "active" : ""}`}
              >
                <Edit className="w-4 h-4" />
                Can Edit
              </button>
            </div>
          </div>

          {/* User Search */}
          <div className="user-search">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* User List */}
          <div className="user-list">
            {filteredUsers.slice(0, 5).map((user) => {
              const isShared = sharedWith.some(share => share.userId === user._id);
              const userPermission = sharedWith.find(share => share.userId === user._id)?.permission;

              return (
                <div key={user._id} className="user-item">
                  <div className="user-info">
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                  
                  <div className="user-actions">
                    {isShared ? (
                      <>
                        <div className="permission-badge">
                          {userPermission === "edit" ? (
                            <>
                              <Edit className="w-3 h-3" />
                              Can Edit
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3" />
                              View Only
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveShare(user._id)}
                          className="action-btn remove"
                          disabled={loading}
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleShareWithUser(user._id)}
                        className="action-btn add"
                        disabled={loading}
                      >
                        <UserPlus className="w-4 h-4" />
                        Share
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Currently Shared */}
        {sharedWith.length > 0 && (
          <div className="shared-with-section">
            <h4>Currently Shared With</h4>
            <div className="shared-list">
              {sharedWith.map((share) => {
                const user = users.find(u => u._id === share.userId);
                if (!user) return null;

                return (
                  <div key={share.userId} className="shared-item">
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                    
                    <div className="shared-actions">
                      <select
                        value={share.permission}
                        onChange={(e) => handleUpdatePermission(share.userId, e.target.value)}
                        className="permission-select"
                        disabled={loading}
                      >
                        <option value="view">Can View</option>
                        <option value="edit">Can Edit</option>
                      </select>
                      <button
                        onClick={() => handleRemoveShare(share.userId)}
                        className="remove-btn"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        <div className="privacy-section">
          <h4>
            <Lock className="w-4 h-4" />
            Privacy Settings
          </h4>
          <div className="privacy-options">
            <label className="privacy-option">
              <input
                type="radio"
                name="privacy"
                checked={!note.isPublic}
                onChange={() => {}}
              />
              <div className="option-content">
                <Lock className="w-4 h-4" />
                <div>
                  <div className="option-title">Private</div>
                  <div className="option-description">
                    Only you and people you share with can access
                  </div>
                </div>
              </div>
            </label>
            <label className="privacy-option">
              <input
                type="radio"
                name="privacy"
                checked={note.isPublic}
                onChange={() => {}}
              />
              <div className="option-content">
                <Globe className="w-4 h-4" />
                <div>
                  <div className="option-title">Public</div>
                  <div className="option-description">
                    Anyone with the link can view
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}