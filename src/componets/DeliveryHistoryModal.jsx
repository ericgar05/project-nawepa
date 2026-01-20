import { useState, useEffect } from "react";
import "../styles/InventoryModal.css";
import * as XLSX from "xlsx";

function DeliveryHistoryModal({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch("http://localhost:4000/movimientos");
          if (!response.ok) {
            throw new Error(
              "No se pudo obtener el historial de entregas del servidor."
            );
          }
          const data = await response.json();
          setHistory(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleExportPDF = () => {
    const dataToExport = history.map((item) => ({
      Producto: item.nombre_producto,
      "Entregado a": `${item.personal_nombre} ${item.personal_apellido}`,
      Cantidad: item.cantidad,
      "Fecha de Entrega": new Date(item.fecha_movimiento).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");

    worksheet["!cols"] = [{ wch: 30 }, { wch: 25 }, { wch: 10 }, { wch: 15 }];

    XLSX.writeFile(workbook, "Historial_Entregas.xlsx");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content inventory-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Historial de Entregas</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-actions" style={{ marginBottom: "1rem" }}>
          <button className="btn-export" onClick={handleExportPDF}>
            Exportar a Excel
          </button>
        </div>
        <div className="inventory-table-container">
          {loading && <p>Cargando historial...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Entregado a</th>
                  <th>Cantidad</th>
                  <th>Fecha de Entrega</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nombre_producto}</td>
                    <td>{`${item.personal_nombre} ${item.personal_apellido}`}</td>
                    <td>{item.cantidad}</td>
                    <td>
                      {new Date(item.fecha_movimiento).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryHistoryModal;
