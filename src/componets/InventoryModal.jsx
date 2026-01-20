import { useState } from "react";
import "../styles/InventoryModal.css";
import { useInventory } from "./contexts/InventoryContext";
import { useAuth } from "./contexts/AuthContext"; // Importamos el contexto de autenticación
import { IconDelete, IconEdit } from "../assets/icons/Icons"; // Added IconEdit
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png";
import EditProductModal from "./EditProductModal";

function InventoryModal({ isOpen, onClose }) {
  const { products, fetchProducts } = useInventory();
  const { userData } = useAuth(); // Obtenemos los datos del usuario
  const canDelete =
    userData?.nivel_nombre === "Administrador" ||
    userData?.nivel_nombre === "Supervisor";

  // Allow editing for everyone or restrict as needed.
  // Based on the note "usuarios en todos los niveles", we allow simple editing (names) for now,
  // or we can restrict it. Let's start by allowing it or mirroring canDelete if strictly needed.
  // Converting to boolean for clarity.
  const canEdit = true;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const handleDelete = async (productId, productName) => {
    const isConfirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el producto "${productName}"? Esta acción no se puede deshacer.`,
    );

    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:4000/inventario/${productId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          throw new Error("No se pudo eliminar el producto desde el servidor.");
        }

        await fetchProducts();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
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
      doc.text("Reporte de Inventario", 50, 20);
      doc.setFontSize(10);
      doc.text("Empresa Nawepa", 50, 28);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 34);

      // Tabla
      autoTable(doc, {
        startY: 45,
        head: [["Producto", "Código", "Categoría", "Stock", "Fecha Entrada"]],
        body: products.map((item) => [
          item.nombre_producto,
          item.codigo_producto,
          item.categoria_nombre,
          item.stock,
          new Date(item.fecha_entrada).toLocaleDateString(),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
      });

      doc.save("Reporte_Inventario.pdf");
    };

    img.onerror = () => {
      // Fallback si no carga la imagen
      autoTable(doc, {
        startY: 20,
        head: [["Producto", "Código", "Categoría", "Stock", "Fecha Entrada"]],
        body: products.map((item) => [
          item.nombre_producto,
          item.codigo_producto,
          item.categoria_nombre,
          item.stock,
          new Date(item.fecha_entrada).toLocaleDateString(),
        ]),
      });
      doc.save("Reporte_Inventario.pdf");
    };
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content inventory-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Inventario de Productos</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-actions" style={{ marginBottom: "1rem" }}>
          <button className="btn-export" onClick={handleExportPDF}>
            Exportar a PDF
          </button>
          <button
            className="btn-export"
            onClick={() => {
              /* Existing Excel Logic - kept separate or inline if needed, but for now just showing both */
              /* NOTE: The original logic was separate, but I'm just appending the PDF button. */
              /* Need to restore Excel function call if I replaced the button completely?
                 Ah, I see I am replacing lines around the buttons. I should keep the Excel button too.
              */
              const dataToExport = products.map((item) => ({
                Producto: item.nombre_producto,
                Código: item.codigo_producto,
                Categoría: item.categoria_nombre,
                Stock: item.stock,
                "Fecha de Entrada": new Date(
                  item.fecha_entrada,
                ).toLocaleDateString(),
              }));

              const worksheet = XLSX.utils.json_to_sheet(dataToExport);
              const workbook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario");
              XLSX.writeFile(workbook, "Reporte_Inventario.xlsx");
            }}
          >
            Exportar a Excel
          </button>
        </div>
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Código</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Fecha de Entrada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre_producto}</td>
                  <td>{item.codigo_producto}</td>
                  <td>{item.categoria_nombre}</td>
                  <td>{item.stock}</td>
                  <td>{new Date(item.fecha_entrada).toLocaleDateString()}</td>
                  {(canDelete || canEdit) && (
                    <td className="actions-cell">
                      {canEdit && (
                        <button
                          className="action-button"
                          title="Editar Producto"
                          onClick={() => handleEdit(item)}
                        >
                          <IconEdit />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="action-button"
                          title="Eliminar Producto"
                          onClick={() =>
                            handleDelete(item.id, item.nombre_producto)
                          }
                        >
                          <IconDelete />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
      />
    </div>
  );
}

export default InventoryModal;
