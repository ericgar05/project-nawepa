import React from "react";
import { useInventory } from "./contexts/InventoryContext";
import "../styles/DashboardSummary.css";

function DashboardSummary() {
  const { inventoryByCategory } = useInventory();

  const categoryStyles = {
    Limpieza: { color: "blue" },
    Papeleria: { color: "purple" },
    Mantenimiento: { color: "orange" },
  };

  const defaultStyle = { color: "gray" };

  const getCategoryStyle = (categoryName) => {
    return categoryStyles[categoryName] || defaultStyle;
  };

  if (Object.keys(inventoryByCategory).length === 0) {
    return <p>Calculando resumen de inventario...</p>;
  }
  return (
    <div className="summary-container">
      {Object.entries(inventoryByCategory).map(([category, totalStock]) => {
        const { icon, color } = getCategoryStyle(category);
        return (
          <div className={`summary-card color-${color}`} key={category}>
            <div className="card-header">
              <h3 className="summary-card-title">{category}</h3>
              <span className="summary-card-icon">{icon}</span>
            </div>
            <p className="summary-card-stock">{totalStock}</p>
            <p className="summary-card-label">Artículos en Stock</p>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardSummary;
