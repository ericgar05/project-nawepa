import { useState } from "react";
import "../styles/InventoryModal.css";

function ManualModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content inventory-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "95%",
          height: "95%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="modal-header">
          <h2>Manual de Usuario</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div style={{ flex: 1, padding: "10px", height: "100%" }}>
          <iframe
            src="/manual.pdf"
            title="Manual de Usuario"
            width="100%"
            height="100%"
            style={{ border: "none", borderRadius: "8px" }}
          />
        </div>
      </div>
    </div>
  );
}

export default ManualModal;
