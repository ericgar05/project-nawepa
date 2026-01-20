import { useState, useEffect } from "react";
import AssignProductModal from "./AssignProductModal";
import { IconAdd, IconAssign } from "../assets/icons/Icons";
import "../styles/InventoryModal.css";
import * as XLSX from "xlsx";

function EmployeesModal({ isOpen, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchEmployees = async () => {
        try {
          setLoading(true);
          const response = await fetch("http://localhost:4000/personal");
          if (!response.ok) {
            throw new Error("No se pudo obtener la lista de empleados.");
          }
          const data = await response.json();
          setEmployees(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchEmployees();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleOpenAssignModal = (employee) => {
    setSelectedEmployee(employee);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleExportPDF = () => {
    const dataToExport = employees.map((employee) => ({
      Nombre: employee.nombre,
      Apellido: employee.apellido,
      Cargo: employee.cargo,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Empleados");

    worksheet["!cols"] = [{ wch: 20 }, { wch: 20 }, { wch: 25 }];

    XLSX.writeFile(workbook, "Reporte_Empleados.xlsx");
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Gestionar Empleados</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-actions" style={{ marginBottom: "1rem" }}>
            <button className="btn-export" onClick={handleExportPDF}>
              Exportar a Excel
            </button>
          </div>
          <div className="inventory-list">
            {loading && <p>Cargando empleados...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && (
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Cargo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.nombre}</td>
                      <td>{employee.apellido}</td>
                      <td>{employee.cargo}</td>
                      <td className="actions-cell">
                        <button
                          className="action-button"
                          title="Asignar Producto"
                          onClick={() => handleOpenAssignModal(employee)}
                        >
                          <IconAdd />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {isAssignModalOpen && (
        <AssignProductModal
          employee={selectedEmployee}
          onClose={handleCloseAssignModal}
        />
      )}
    </>
  );
}

export default EmployeesModal;
