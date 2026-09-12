import React from "react";
import "./ConfirmDialog.css";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog-icon">
          ⚠️
        </div>

        <h3>{title}</h3>

        <p>{message}</p>

        <div className="confirm-dialog-actions">
          {cancelText && (
  <button
    type="button"
    className="confirm-dialog-cancel"
    onClick={onCancel}
  >
    {cancelText}
  </button>
)}

          <button
            type="button"
            className="confirm-dialog-confirm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;