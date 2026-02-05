"use client";

import React from "react";
import "@/styles/components/error-modal.css";

export default function ErrorModal({ open, title = "Error", message = "", onClose }) {
  if (!open) return null;
  return (
    <div className="error-modal-overlay">
      <div className="error-modal-content">
        <div className="error-modal-header">
          <h3 className="error-modal-title">{title}</h3>
          <button onClick={onClose} className="error-modal-close">✕</button>
        </div>
        <div className="error-modal-body">
          {typeof message === 'string' ? <p className="error-modal-message">{message}</p> : message}
        </div>
        <div className="error-modal-footer">
          <button onClick={onClose} className="error-modal-btn">Close</button>
  );
}
