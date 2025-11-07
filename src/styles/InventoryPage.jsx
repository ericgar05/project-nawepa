import React from "react";
import { Link } from "react-router-dom";
import { useInventory } from "./contexts/InventoryContext";
import "../styles/InventoryPage.css"; // Crearemos este archivo a continuación
import Header from "./Header";

function InventoryPage() {
  const { products, loading, error } = useInventory();

  return (
    <div className="inventory-page-container">
      <Header
        title="Inventario de Productos"
        subtitle="Consulta y gestiona todos los productos en stock"
      />
      <div className="inventory-page-content">
        <div className="inventory-list">
          {loading && <p>Cargando inventario...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default InventoryPage;
