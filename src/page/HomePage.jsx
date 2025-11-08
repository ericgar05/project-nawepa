import { useState, useEffect } from "react";
import Header from "../componets/Header";
import Sidebar from "../componets/Sidebar";
import AddProductModal from "../componets/AddProductModal";
import InventoryModal from "../componets/InventoryModal";
import DashboardSummary from "../componets/DashboardSummary";
import AlertsPanel from "../components/AlertsPanel";
import AddUserModal from "../components/AddUserModal"; // Asegúrate que la ruta es correcta
import DeliveryHistoryModal from "../components/DeliveryHistoryModal"; // 1. Importamos el nuevo modal
import PersonalPanel from "../components/PersonalPanel";
import EmployeesModal from "../components/EmployeesModal";
import AddPersonnelModal from "../components/AddPersonnelModal"; // 1. Importamos el nuevo modal de personal

function HomePage() {
  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [iconInventory, setIconInventory] = useState(false); // 1. Estado del ícono movido aquí
  const [isAddPersonnelModalOpen, setAddPersonnelModalOpen] = useState(false); // 2. Añadimos estado para el modal
  const [isEmployeesModalOpen, setEmployeesModalOpen] = useState(false); // 2. Añadimos el estado para el modal de empleados
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false); // 2. Estado para el modal de historial
  const [historyBook, setHistoryBook] = useState(false); // Estado del ícono del historial
  const [niveles, setNiveles] = useState([]);

  const handleOpenInventoryModal = () => {
    setInventoryModalOpen(true);
    setIconInventory(true); // Se activa al abrir
  };
  const handleCloseInventoryModal = () => {
    setInventoryModalOpen(false);
    setIconInventory(false); // Se desactiva al cerrar
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
        onViewEmployeesClick={() => setEmployeesModalOpen(true)} // 3. Pasamos la función para abrir el modal
        onAddUserClick={() => setUserModalOpen(true)}
        onViewHistoryClick={handleOpenHistoryModal} // 3. Pasamos la función para abrir el historial
        iconInventory={iconInventory} // 2. Pasamos el estado del ícono como prop
        historyBook={historyBook} // Pasamos el estado del ícono del historial
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
            onClose={handleCloseInventoryModal} // 3. Usamos la nueva función de cierre
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
            {/* Columna Izquierda (Principal) */}

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
