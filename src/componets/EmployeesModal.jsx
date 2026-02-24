import { useState, useEffect } from "react";
import AssignProductModal from "./AssignProductModal";
import EditPersonnelModal from "./EditPersonnelModal";
import {
  IconAdd,
  IconAssign,
  IconEdit,
  IconDelete,
} from "../assets/icons/Icons";
import "../styles/InventoryModal.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

function EmployeesModal({ isOpen, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const handleOpenEditModal = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp,
      ),
    );
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        const response = await fetch(`http://localhost:4000/personal/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el empleado.");
        }

        setEmployees((prevEmployees) =>
          prevEmployees.filter((emp) => emp.id !== id),
        );
        window.alert("el personal a sido eliminado con éxito");
      } catch (error) {
        console.error("Error:", error);
        alert("No se pudo eliminar el empleado.");
      }
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Empleados", 14, 15);

    const tableColumn = [
      "Nombre",
      "Apellido",
      "Cédula",
      "Correo",
      "Teléfono",
      "Cargo",
    ];
    const tableRows = [];

    employees.forEach((employee) => {
      const employeeData = [
        employee.nombre,
        employee.apellido,
        employee.cedula || "N/A",
        employee.correo || "N/A",
        employee.telefono || "N/A",
        employee.cargo,
      ];
      tableRows.push(employeeData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Reporte_Empleados.pdf");
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content inventory-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Gestionar Empleados</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-actions" style={{ marginBottom: "1rem" }}>
            <button className="btn-export" onClick={handleExportPDF}>
              Exportar a PDF
            </button>
          </div>
          <div className="inventory-table-container">
            {loading && <p>Cargando empleados...</p>}
            {error && <p className="error-message">{error}</p>}
            {!loading && !error && (
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Cédula</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Cargo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.nombre}</td>
                      <td>{employee.apellido}</td>
                      <td>{employee.cedula || "N/A"}</td>
                      <td>{employee.correo || "N/A"}</td>
                      <td>{employee.telefono || "N/A"}</td>
                      <td>{employee.cargo}</td>
                      <td className="actions-cell">
                        <button
                          className="action-button"
                          title="Asignar Producto"
                          onClick={() => handleOpenAssignModal(employee)}
                        >
                          <IconAdd />
                        </button>
                        <button
                          className="action-button"
                          title="Editar Empleado"
                          onClick={() => handleOpenEditModal(employee)}
                        >
                          <IconEdit />
                        </button>
                        <button
                          className="action-button delete"
                          title="Eliminar Empleado"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <IconDelete />
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
      {isEditModalOpen && (
        <EditPersonnelModal
          isOpen={isEditModalOpen}
          employee={selectedEmployee}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateEmployee}
        />
      )}
    </>
  );
}

export default EmployeesModal;
