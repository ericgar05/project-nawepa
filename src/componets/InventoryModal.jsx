import "../styles/InventoryModal.css"; // Asegúrate de que este archivo exista
import { useInventory } from "./contexts/InventoryContext";
import { IconDelete } from "../assets/icons/Icons"; // 1. Importamos el ícono de eliminar

function InventoryModal({ isOpen, onClose }) {
  // Obtenemos los productos directamente del contexto
  const { products, fetchProducts } = useInventory(); // 2. Obtenemos fetchProducts para refrescar la lista

  // 3. Creamos la función para manejar la eliminación
  const handleDelete = async (productId, productName) => {
    // Pedimos confirmación al usuario para evitar borrados accidentales
    const isConfirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el producto "${productName}"? Esta acción no se puede deshacer.`
    );

    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:4000/inventario/${productId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo eliminar el producto desde el servidor.");
        }

        // Si se elimina con éxito, volvemos a cargar los productos para actualizar la vista
        await fetchProducts();
      } catch (error) {
        alert(error.message); // Mostramos una alerta simple en caso de error
      }
    }
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
                  <td className="actions-cell">
                    <button
                      className="action-button"
                      title="Eliminar Producto"
                      onClick={() =>
                        handleDelete(item.id, item.nombre_producto)
                      }
                    >
                      <IconDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InventoryModal;
