import { useAuth } from "./contexts/AuthContext";
import "../styles/Header.css";

function Header() {
  const { userData, handleLogout } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="header-title-group">
        <h1 className="dashboard-title">Dashboard</h1>
        {userData && (
          <p className="dashboard-subtitle">Bienvenido, {userData.name}</p>
        )}
      </div>
      <button onClick={handleLogout} className="btn btn-logout">
        Cerrar Sesión
      </button>
    </header>
  );
}

export default Header;
