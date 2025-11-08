import { useState, useEffect } from "react";
import "../styles/InventoryModal.css"; // Reutilizamos los estilos del modal de inventario

function DeliveryHistoryModal({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch("http://localhost:4000/movimientos");
          if (!response.ok) {
            throw new Error("No se pudo cargar el historial.");
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
        <div className="inventory-table-container">
          {loading && <p>Cargando historial...</p>}
          {error && <div className="error-banner">{error}</div>}
          {!loading && !error && (
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Fecha de Salida</th>
                  <th>Empleado</th>
                  <th>Producto Entregado</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {new Date(item.fecha_movimiento).toLocaleDateString()}
                      </td>
                      <td>{`${item.personal_nombre} ${item.personal_apellido}`}</td>
                      <td>{item.nombre_producto}</td>
                      <td>{item.cantidad}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No hay registros de entregas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeliveryHistoryModal;
