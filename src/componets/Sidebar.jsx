import { useAuth } from "./contexts/AuthContext";
import { useState } from "react";
import "../styles/Sidebar.css";
import {
  IconAdd,
  IconInventory,
  IconLogout,
  IconEmployees,
  IconUser,
  IconBook,
  IconBookOpen,
  IconInventoryOpen,
  IconSearch,
} from "../assets/icons/Icons";

function Sidebar({
  onAddProductClick,
  onViewInventoryClick,
  onAddUserClick,
  onViewEmployeesClick,
  onViewHistoryClick,
  iconInventory,
  historyBook, // Recibimos el estado del ícono del historial
}) {
  const { userData } = useAuth();
  const { handleLogout } = useAuth();

  const handleViewInventoryClick = () => {
    onViewInventoryClick();
  };

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
          <IconAdd className="sidebar-icon-add" />
          Agregar Producto
        </button>
        <button className="sidebar-button">
          <IconSearch className="sidebar-icon-add" />
          Buscar Producto
        </button>
        <button className="sidebar-button" onClick={onViewHistoryClick}>
          {historyBook ? <IconBookOpen /> : <IconBook />}
          Historial De Entregas
        </button>
        <button className="sidebar-button" onClick={handleViewInventoryClick}>
          {iconInventory ? <IconInventoryOpen /> : <IconInventory />}
          Ver Inventario
        </button>
        {/* El botón "Añadir Usuario" solo se muestra si el usuario es Administrador */}
        {isAdmin && (
          <>
            <button className="sidebar-button" onClick={onViewEmployeesClick}>
              <IconEmployees />
              Empleados
            </button>
            <button className="sidebar-button" onClick={onAddUserClick}>
              <IconUser />
              Añadir Usuario
            </button>
          </>
        )}
      </nav>
      <footer className="sidebar-footer">
        <button className="sidebar-button" onClick={handleLogout}>
          <IconLogout />
          Cerrar Sesión
        </button>
      </footer>
    </aside>
  );
}

export default Sidebar;
