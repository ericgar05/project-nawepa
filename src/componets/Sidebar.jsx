import React from "react";
import { useAuth } from "./contexts/AuthContext";
import "../styles/Sidebar.css"; // Crearemos este archivo para los estilos

function Sidebar({ onAddProductClick, onViewInventoryClick, onAddUserClick }) {
  const { userData } = useAuth();

  // Condición para mostrar botones solo a administradores
  const isAdmin = userData && userData.nivel_nombre === "Administrador";

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Nawepa</h1>
        <p className="sidebar-subtitle">Control de Inventario</p>
      </div>
      <nav className="sidebar-nav">
        <button className="sidebar-button" onClick={onAddProductClick}>
          <span className="sidebar-icon">+</span>
          Agregar Producto
        </button>
        <button className="sidebar-button" onClick={onViewInventoryClick}>
          <span className="sidebar-icon">📄</span>
          Ver Inventario
        </button>
        {/* El botón "Añadir Usuario" solo se muestra si el usuario es Administrador */}
        {isAdmin && (
          <button className="sidebar-button" onClick={onAddUserClick}>
            <span className="sidebar-icon">👤</span>
            Añadir Usuario
          </button>
        )}
      </nav>
      <div className="sidebar-footer"></div>
    </aside>
  );
}

export default Sidebar;
