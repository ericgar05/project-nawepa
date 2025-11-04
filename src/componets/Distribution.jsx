import React from "react";
import { useInventory } from "./contexts/InventoryContext";

const Distribution = () => {
  const { inventory } = useInventory();

  const total = Object.values(inventory).reduce((sum, value) => sum + value, 0);

  const distribucion = [
    {
      categoria: "Limpieza",
      valor: inventory.limpieza,
      icono: "🧼",
      tipo: "limpieza",
    },
    {
      categoria: "Papelería",
      valor: inventory.papeleria,
      icono: "📄",
      tipo: "papeleria",
    },
    {
      categoria: "Mantenimiento",
      valor: inventory.mantenimiento,
      icono: "🔧",
      tipo: "mantenimiento",
    },
  ].map((item) => ({
    ...item,
    porcentaje: total > 0 ? Math.round((item.valor / total) * 100) + "%" : "0%",
  }));

  return (
    <div className="distribution">
      <h2>Distribución de Productos</h2>
      <p className="distribution-subtitle">Inventario total por categoría</p>

      {distribucion.map((item, index) => (
        <div key={index} className="distribution-item">
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
