import { useInventory } from "./contexts/InventoryContext";
import "../styles/Resume.css"; // Reutilizamos los estilos que ya tienes

function AlertsPanel() {
  const { lowStockAlerts } = useInventory();

  return (
    <div className="alertas-panel">
      <div className="alertas-header">
        <h2>Alertas de Stock</h2>
        {lowStockAlerts.length > 0 && (
          <span className="contador-alertas">
            {lowStockAlerts.length}{" "}
            {lowStockAlerts.length === 1 ? "alerta" : "alertas"}
          </span>
        )}
      </div>
      <div className="lista-alertas">
        {lowStockAlerts.length > 0 ? (
          lowStockAlerts.map((alerta) => (
            <div key={alerta.id} className="alerta-item stock-bajo">
              {/* <span className="alerta-icono"></span> */}
              <div className="alerta-contenido">
                <div className="alerta-titulo">{alerta.nombre_producto}</div>
                <p className="alerta-descripcion">
                  Solo quedan {alerta.stock} unidades en stock.
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="panel-subtitle">
            No hay alertas de stock bajo por el momento. ¡Buen trabajo!
          </p>
        )}
      </div>
    </div>
  );
}

export default AlertsPanel;
