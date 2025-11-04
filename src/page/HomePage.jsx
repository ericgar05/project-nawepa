import { useState } from "react";
import "../styles/Resume.css";
import Metrics from "../componets/Metrics";
import Distribution from "../componets/Distribution";
import Header from "../componets/Header";
import AddProductModal from "../componets/AddProductModal";
import InventoryModal from "../componets/InventoryModal";
import DashboardSummary from "../componets/DashboardSummary";
import AlertsPanel from "../componets/AlertsPanel";

function HomePage() {
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);

  return (
    <>
      <Header
        onAddProductClick={() => setAddProductModalOpen(true)}
        onViewInventoryClick={() => setInventoryModalOpen(true)}
      />

      <section className="home-container">
        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setAddProductModalOpen(false)}
        />
        <InventoryModal
          isOpen={isInventoryModalOpen}
          onClose={() => setInventoryModalOpen(false)}
        />
        <div className="dashboard-layout">
          {/* Columna Izquierda (Principal) */}
          <div className="left-column">
            <DashboardSummary />
            <AlertsPanel />
          </div>
          {/* Columna Derecha (Barra Lateral) */}
          <div className="right-column">
            <div className="personal-panel">
              <div className="panel-header">
                <h2>Personal Activo</h2>
              </div>
              <button className="btn-primario">Gestionar Personal</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
