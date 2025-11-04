import React from "react";
import "../styles/InventoryModal.css"; // Asegúrate de que este archivo exista
import { useInventory } from "./contexts/InventoryContext";

function InventoryModal({ isOpen, onClose }) {
  // Obtenemos los productos directamente del contexto
  const { products } = useInventory();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Inventario de Productos</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="inventory-list">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Código</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Fecha de Entrada</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre_producto}</td>
                  <td>{item.codigo_producto}</td>
                  <td>{item.categoria_nombre}</td>
                  <td>{item.stock}</td>
                  <td>{new Date(item.fecha_entrada).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryModal;
