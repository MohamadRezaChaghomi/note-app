"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import "@/styles/components/notes.css";
export default function NoteSharing({ note, onClose, onUpdate }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl] = useState(`${typeof window !== "undefined" ? window.location.origin : ""}/notes/${note._id}`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Note</h2>
          <button onClick={onClose} className="modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body">
          <div className="share-section">
            <h3 className="share-title">Share Link</h3>
            <div className="share-link-container">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="share-link-input"
              />
              <button
                onClick={handleCopyLink}
                className="copy-btn"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
