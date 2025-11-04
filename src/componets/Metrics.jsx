import { useInventory } from "./contexts/InventoryContext";

const Metrics = () => {
  const { inventory } = useInventory();

  const metricas = [
    {
      titulo: "LIMPIEZA",
      valor: inventory.limpieza,
      icono: "🧼",
      categoria: "limpieza",
    },
    {
      titulo: "PAPELERÍA",
      valor: inventory.papeleria,
      icono: "📄",
      categoria: "papeleria",
    },
    {
      titulo: "MANTENIMIENTO",
      valor: inventory.mantenimiento,
      icono: "🔧",
      categoria: "mantenimiento",
    },
  ];

  return (
    <div className="metrics">
      {metricas.map((metrica, index) => (
        <div key={index} className={`metric-card ${metrica.categoria}`}>
          <div className="metric-icon">{metrica.icono}</div>
          <div className="metric-value">{metrica.valor}</div>
          <div className="metric-title">{metrica.titulo}</div>
        </div>
      ))}
    </div>
  );
};

export default Metrics;
