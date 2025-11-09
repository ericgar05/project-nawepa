import { useState } from "react";
import { useInventory } from "./contexts/InventoryContext";
import "../styles/AddProductModal.css"; // Reutilizamos estilos del modal

function AssignProductModal({ employee, onClose }) {
  const { products, fetchProducts } = useInventory(); // Usamos el contexto de inventario
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0) {
      setError("Por favor, selecciona un producto y una cantidad válida.");
      return;
    }

    // --- INICIO DE LA CORRECCIÓN ---
    // Movemos la búsqueda del producto aquí dentro.
    // Así nos aseguramos de usar el estado más reciente de 'selectedProduct'.
    // Comparamos `p.id` (string) con `selectedProduct` (string) directamente.
    const productDetails = products.find((p) => p.id === selectedProduct);
    console.log("Product details es igual a", productDetails);

    if (!productDetails) {
      setError(
        "El producto seleccionado no es válido. Por favor, recarga e intenta de nuevo."
      );
      return;
    }
    // --- FIN DE LA CORRECCIÓN ---
    if (productDetails.stock < quantity) {
      setError("La cantidad a asignar no puede ser mayor que el stock actual.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Asignando producto:", selectedProduct);
      const response = await fetch("http://localhost:4000/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          producto_id: selectedProduct, // Se envía como string, el backend lo maneja.
          personal_id: employee.id,
          cantidad: parseInt(quantity),
          fecha_movimiento: new Date().toISOString().split("T")[0],
          tipo_movimiento: "salida",
        }),
      });

      const responseData = await response.json();
      console.log(responseData);

      if (!response.ok) {
        throw new Error(
          responseData.detalle || "Error al asignar el producto."
        );
      }

      // Si la asignación es exitosa, actualizamos el inventario en el frontend y cerramos el modal
      await fetchProducts();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }; // <-- LA LLAVE DE CIERRE DE handleSubmit VA AQUÍ

  // También podemos obtener los detalles aquí para usarlos en la UI (como en el 'max' del input)
  // Hacemos la misma corrección aquí para la UI.
  const productDetailsForUI = products.find((p) => p.id === selectedProduct);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Asignar Producto a {employee.nombre}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="producto">Producto</label>
            <select
              id="producto"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Selecciona un producto</option>
              {products
                .filter((p) => p.stock > 0) // Solo mostrar productos con stock
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.nombre_producto} (Stock: {product.stock})
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cantidad">Cantidad a Asignar</label>
            <input
              id="cantidad"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={productDetailsForUI?.stock} // Limita la cantidad máxima al stock disponible
              required
            />
            {productDetailsForUI && (
              <small>Stock disponible: {productDetailsForUI.stock}</small>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-primario"
              disabled={isSubmitting || !selectedProduct}
            >
              {isSubmitting ? "Asignando..." : "Confirmar Asignación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignProductModal;
