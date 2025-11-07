import { useState, useEffect } from "react";
import Header from "../componets/Header";
import Sidebar from "../componets/Sidebar";
import AddProductModal from "../componets/AddProductModal";
import InventoryModal from "../componets/InventoryModal";
import DashboardSummary from "../componets/DashboardSummary";
import AlertsPanel from "../componets/AlertsPanel";
import AddPersonnelModal from "../componets/AddPersonnelModal";
import AddUserModal from "../componets/AddUserModal";

function HomePage() {
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [isPersonnelModalOpen, setPersonnelModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [niveles, setNiveles] = useState([]);

  useEffect(() => {
    const fetchNiveles = async () => {
      try {
        const response = await fetch("http://localhost:4000/niveles");
        const data = await response.json();
        if (response.ok) setNiveles(data);
        else console.error("Error al cargar niveles:", data.error);
      } catch (error) {
        console.error("Error de red al cargar niveles:", error);
      }
    };
    fetchNiveles();
  }, []);

  return (
    <div className="app-layout">
      <Sidebar
        onAddProductClick={() => setAddProductModalOpen(true)}
        onViewInventoryClick={() => setInventoryModalOpen(true)}
        onAddUserClick={() => setUserModalOpen(true)}
      />
      <main className="main-content">
        <section className="header-content">
          <Header />
        </section>
        <section className="home-container">
          <AddProductModal
            isOpen={isAddProductModalOpen}
            onClose={() => setAddProductModalOpen(false)}
          />
          <InventoryModal
            isOpen={isInventoryModalOpen}
            onClose={() => setInventoryModalOpen(false)}
          />
          <AddPersonnelModal
            isOpen={isPersonnelModalOpen}
            onClose={() => setPersonnelModalOpen(false)}
          />
          <AddUserModal
            isOpen={isUserModalOpen}
            onClose={() => setUserModalOpen(false)}
            niveles={niveles}
          />
          <div className="dashboard-layout">
            {/* Columna Izquierda (Principal) */}

            <DashboardSummary />

            <AlertsPanel />

            <div className="personal-panel">
              <div className="panel-header">
                <h2>Personal Activo</h2>
              </div>
              <button
                className="btn-primario"
                onClick={() => setPersonnelModalOpen(true)}
              >
                Gestionar Personal
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
