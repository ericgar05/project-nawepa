import React from "react";
import { useInventory } from "./contexts/InventoryContext";

const Distribution = () => {
  const { inventoryByCategory } = useInventory();

  // Mapeo de categorías a íconos y clases para mantener el estilo
  const categoryDetails = {
    Limpieza: { icono: "🧼", tipo: "limpieza" },
    Papeleria: { icono: "📄", tipo: "papeleria" },
    Mantenimiento: { icono: "🔧", tipo: "mantenimiento" },
    // Agrega más categorías si es necesario
  };
  const defaultDetails = { icono: "📦", tipo: "default" };

  const total = Object.values(inventoryByCategory).reduce(
    (sum, value) => sum + value,
    0
  );

  const distribucion = Object.entries(inventoryByCategory).map(
    ([categoria, valor]) => {
      const details = categoryDetails[categoria] || defaultDetails;
      return {
        categoria,
        valor,
        ...details,
        porcentaje: total > 0 ? Math.round((valor / total) * 100) + "%" : "0%",
      };
    }
  );

  return (
    <div className="distribution">
      <h2>Distribución de Productos</h2>
      <p className="distribution-subtitle">Inventario total por categoría</p>

      {distribucion.map((item) => (
        <div key={item.categoria} className="distribution-item">
          <div className={`distribution-icon ${item.tipo}`}>{item.icono}</div>
          <div className="distribution-info">
            <div className="distribution-category">{item.categoria}</div>
            <div className="distribution-details">
              <span>{item.valor} productos</span>
              <span>{item.porcentaje} del total</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Distribution;
