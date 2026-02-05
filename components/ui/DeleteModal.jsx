"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import styles from "@/styles/components/ui/delete-modal.module.css";

export default function DeleteModal({ 
  isOpen = false, 
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = true
}) {
  if (!isOpen) return null;

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-container"]}>
        {/* Modal Header */}
        <div className={styles["modal-header"]}>
          <div className={`${styles["modal-icon"]} ${styles[isDangerous ? "danger" : "warning"]}`}>
            <AlertTriangle size={24} />
          </div>
          <h2 className={styles["modal-title"]}>{title}</h2>
        </div>

        {/* Modal Body */}
        <div className={styles["modal-body"]}>
          <p className={styles["modal-description"]}>
            {description}
          </p>
          
          {itemName && (
            <div className={styles["modal-item-name"]}>
              <span className={styles["item-label"]}>Item:</span>
              <span className={styles["item-value"]}>{itemName}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles["modal-footer"]}>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className={styles["modal-cancel-btn"]}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={styles["modal-confirm-btn"]}
          >
            {isLoading ? (
              <>
                <span className={styles["spinner"]} />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
