import { useState, useEffect } from "react";
import "../styles/AddProductModal.css"; // Reusing styles
import { useInventory } from "./contexts/InventoryContext";

function EditProductModal({ isOpen, onClose, productToEdit }) {
  const { updateProduct, categorias } = useInventory();
  const [formData, setFormData] = useState({
    nombre_producto: "",
    codigo_producto: "",
    categoria_id: "",
    stock: 0,
    fecha_entrada: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre_producto: productToEdit.nombre_producto,
        codigo_producto: productToEdit.codigo_producto,
        categoria_id: productToEdit.categoria_id,
        stock: productToEdit.stock,
        fecha_entrada: productToEdit.fecha_entrada
          ? new Date(productToEdit.fecha_entrada).toISOString().split("T")[0]
          : "",
      });
    }
  }, [productToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "categoria_id" || name === "stock"
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateProduct(productToEdit.id, formData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Producto</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="edit_nombre_producto">Nombre del Producto</label>
            <input
              id="edit_nombre_producto"
              type="text"
              name="nombre_producto"
              value={formData.nombre_producto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit_codigo_producto">Código del Producto</label>
            <input
              id="edit_codigo_producto"
              type="text"
              name="codigo_producto"
              value={formData.codigo_producto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit_categoria_id">Categoría</label>
              <select
                id="edit_categoria_id"
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryname}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit_stock">Stock Actual</label>
              <input
                id="edit_stock"
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="fecha_entrada">Fecha de Entrada</label>
            <input
              id="fecha_entrada"
              type="date"
              name="fecha_entrada"
              value={formData.fecha_entrada}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-primario"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
