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
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";
import * as XLSX from "xlsx";

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

    // Configurar la imagen del logo
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      // Dibujar logo
      doc.addImage(img, "PNG", 14, 10, 30, 30); // x, y, ancho, alto

      // Título y datos de la empresa
      doc.setFontSize(18);
      doc.text("Reporte de Personal", 50, 20);
      doc.setFontSize(10);
      doc.text("Empresa Nawepa", 50, 28);
      doc.text(
        `Fecha: ${new Date().toLocaleDateString()} - Hora: ${new Date().toLocaleTimeString()}`,
        50,
        34,
      );

      // Tabla
      autoTable(doc, {
        startY: 45,
        head: [["Nombre", "Apellido", "Cédula", "Correo", "Teléfono", "Cargo"]],
        body: employees.map((employee) => [
          employee.nombre,
          employee.apellido,
          employee.cedula || "N/A",
          employee.correo || "N/A",
          employee.telefono || "N/A",
          employee.cargo,
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] }, // Mismo color que InventoryModal
      });

      // Firma Centrada
      const finalY = doc.lastAutoTable.finalY;
      const pageWidth = doc.internal.pageSize.getWidth();
      const centerX = pageWidth / 2;
      const lineLength = 70;
      const startX = centerX - lineLength / 2;
      const endX = centerX + lineLength / 2;

      doc.line(startX, finalY + 40, endX, finalY + 40);
      doc.text("Firma de Responsable", centerX, finalY + 45, {
        align: "center",
      });

      doc.save("Reporte_Personal.pdf");
    };

    img.onerror = () => {
      // Fallback si no carga la imagen
      autoTable(doc, {
        startY: 20,
        head: [["Nombre", "Apellido", "Cédula", "Correo", "Teléfono", "Cargo"]],
        body: employees.map((employee) => [
          employee.nombre,
          employee.apellido,
          employee.cedula || "N/A",
          employee.correo || "N/A",
          employee.telefono || "N/A",
          employee.cargo,
        ]),
      });

      // Firma (Fallback) - Centrada
      const finalY = doc.lastAutoTable.finalY;
      const pageWidth = doc.internal.pageSize.getWidth();
      const centerX = pageWidth / 2;
      const lineLength = 70;
      const startX = centerX - lineLength / 2;
      const endX = centerX + lineLength / 2;

      doc.line(startX, finalY + 40, endX, finalY + 40);
      doc.text("Firma de Responsable", centerX, finalY + 45, {
        align: "center",
      });

      doc.save("Reporte_Personal.pdf");
    };
  };

  const handleExportExcel = () => {
    const dataToExport = employees.map((employee) => ({
      Nombre: employee.nombre,
      Apellido: employee.apellido,
      Cédula: employee.cedula || "N/A",
      Correo: employee.correo || "N/A",
      Teléfono: employee.telefono || "N/A",
      Cargo: employee.cargo,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Personal");

    // Ajustar el ancho de las columnas
    worksheet["!cols"] = [
      { wch: 20 }, // Nombre
      { wch: 20 }, // Apellido
      { wch: 15 }, // Cédula
      { wch: 25 }, // Correo
      { wch: 15 }, // Teléfono
      { wch: 20 }, // Cargo
    ];

    XLSX.writeFile(workbook, "Reporte_Personal.xlsx");
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
          <div
            className="modal-actions"
            style={{ marginBottom: "1rem", display: "flex", gap: "10px" }}
          >
            <button className="btn-export" onClick={handleExportPDF}>
              Exportar a PDF
            </button>
            <button className="btn-export" onClick={handleExportExcel}>
              Exportar a Excel
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
