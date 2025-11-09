import { useState, useEffect } from "react";
import Header from "../componets/Header";
import Sidebar from "../componets/Sidebar";
import AddProductModal from "../componets/AddProductModal";
import InventoryModal from "../componets/InventoryModal";
import DashboardSummary from "../componets/DashboardSummary";
import AlertsPanel from "../componets/AlertsPanel";
import AddUserModal from "../componets/AddUserModal";
import DeliveryHistoryModal from "../componets/DeliveryHistoryModal";
import PersonalPanel from "../componets/PersonalPanel";
import EmployeesModal from "../componets/EmployeesModal";
import AddPersonnelModal from "../componets/AddPersonnelModal";

function HomePage() {
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [iconInventory, setIconInventory] = useState(false);
  const [isAddPersonnelModalOpen, setAddPersonnelModalOpen] = useState(false);
  const [isEmployeesModalOpen, setEmployeesModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [historyBook, setHistoryBook] = useState(false);
  const [niveles, setNiveles] = useState([]);

  const handleOpenInventoryModal = () => {
    setInventoryModalOpen(true);
    setIconInventory(true);
  };
  const handleCloseInventoryModal = () => {
    setInventoryModalOpen(false);
    setIconInventory(false);
  };

  const handleOpenHistoryModal = () => {
    setHistoryModalOpen(true);
    setHistoryBook(true);
  };
  const handleCloseHistoryModal = () => {
    setHistoryModalOpen(false);
    setHistoryBook(false);
  };

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
        onViewInventoryClick={handleOpenInventoryModal}
        onViewEmployeesClick={() => setEmployeesModalOpen(true)}
        onAddUserClick={() => setUserModalOpen(true)}
        onViewHistoryClick={handleOpenHistoryModal}
        iconInventory={iconInventory}
        historyBook={historyBook}
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
            onClose={handleCloseInventoryModal}
          />
          <EmployeesModal
            isOpen={isEmployeesModalOpen}
            onClose={() => setEmployeesModalOpen(false)}
          />
          <DeliveryHistoryModal
            isOpen={isHistoryModalOpen}
            onClose={handleCloseHistoryModal}
          />
          <AddUserModal
            isOpen={isUserModalOpen}
            onClose={() => setUserModalOpen(false)}
            niveles={niveles}
          />
          <AddPersonnelModal
            isOpen={isAddPersonnelModalOpen}
            onClose={() => setAddPersonnelModalOpen(false)}
          />
          <div className="dashboard-layout">
            <DashboardSummary />

            <AlertsPanel />
            <PersonalPanel
              onAddPersonnelClick={() => setAddPersonnelModalOpen(true)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
