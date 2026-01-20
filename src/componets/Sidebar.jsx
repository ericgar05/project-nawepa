import { useAuth } from "./contexts/AuthContext";

import logoNawepa from "../assets/logo.png";
import "../styles/Sidebar.css";
import {
  IconAdd,
  IconInventory,
  IconLogout,
  IconEmployees,
  IconUser,
  IconBook,
  IconSearch,
} from "../assets/icons/Icons";

function Sidebar({
  onAddProductClick,
  onViewInventoryClick,
  onAddUserClick,
  onViewEmployeesClick,
  onViewHistoryClick,
}) {
  const { userData } = useAuth();
  const { handleLogout } = useAuth();

  const handleViewInventoryClick = () => {
    onViewInventoryClick();
  };

  // Definimos los permisos basados en el rol del usuario
  const userRole = userData?.nivel_nombre;
  const isAdmin = userRole === "Administrador";
  const isSupervisor = userRole === "Supervisor";
  const isEmpleado = userRole === "Empleado";

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <img src={logoNawepa} alt="Logo Nawepa" className="sidebar-logo" />
        <h1 className="sidebar-title">Nawepa</h1>
        <p className="sidebar-subtitle">Control de Inventario</p>
      </div>
      <nav className="sidebar-nav">
        {(isAdmin || isSupervisor || isEmpleado) && (
          <button className="sidebar-button" onClick={onAddProductClick}>
            <IconAdd className="sidebar-icon-add" />
            Agregar Producto
          </button>
        )}

        {(isAdmin || isSupervisor) && (
          <button className="sidebar-button" onClick={onViewHistoryClick}>
            <IconBook />
            Historial De Entregas
          </button>
        )}

        {(isAdmin || isSupervisor || isEmpleado) && (
          <button className="sidebar-button" onClick={handleViewInventoryClick}>
            <IconInventory />
            Ver Inventario
          </button>
        )}

        {(isAdmin || isSupervisor) && (
          <button className="sidebar-button" onClick={onViewEmployeesClick}>
            <IconEmployees />
            Empleados
          </button>
        )}

        {isAdmin && ( // Solo el Administrador puede añadir usuarios
          <>
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
