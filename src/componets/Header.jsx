import { useAuth } from "./contexts/AuthContext";
import "../styles/Header.css";

function Header({ onAddProductClick, onViewInventoryClick }) {
  const { handleLogout } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="header-title-group">
        <h1 className="dashboard-title">Centro Comercial Gold Country</h1>
        <p className="dashboard-subtitle">Sistema de Control de Productos</p>
      </div>
      <div className="header-actions">
        <button className="btn" onClick={onAddProductClick}>
          <span className="btn-icon">+</span>
          Agregar Producto
        </button>
        <button className="btn" onClick={onViewInventoryClick}>
          {/* <span className="btn-icon"></span> */}
          Ver Inventario
        </button>
        <button onClick={handleLogout} className="btn btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}

export default Header;
