import { useState } from "react";
import "../styles/AddProductModal.css";
import { useInventory } from "./contexts/InventoryContext";

function AddProductModal({ isOpen, onClose }) {
  const { handleProduct, categorias, products } = useInventory(); // Añadimos 'products'
  console.log("Productos disponibles:", products);
  //necesito que categoria ID me devuelva la categoria del producto en products

  const initialState = {
    nombre_producto: "",
    codigo_producto: "",
    categoria_id: "",
    stock: 0,
    fecha_entrada: new Date().toISOString().split("T")[0],
  };
  const [formInventory, setFormInventory] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExistingProduct, setIsExistingProduct] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setFormInventory(initialState);
    setError(null);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "codigo_producto") {
      const existingProduct = products.find((p) => p.codigo_producto === value);
      console.log("Lo que tiene en esta variable es:", existingProduct);
      if (existingProduct) {
        // Si el producto existe, llenamos el formulario con sus datos
        setFormInventory((prev) => ({
          ...prev,
          nombre_producto: existingProduct.nombre_producto,
          categoria_id: existingProduct.categoria_id,

          codigo_producto: value,
          stock: 0,
        }));
        console.log(categorias);
        setIsExistingProduct(true);
      } else {
        // Si no existe, limpiamos los campos relacionados (excepto el código que se está escribiendo)
        setFormInventory((prev) => ({
          ...prev,
          nombre_producto: "",
          codigo_producto: value,
          categoria_id: "",
        }));
        setIsExistingProduct(false);
      }
    } else {
      // Para cualquier otro campo, actualizamos el estado normalmente
      const newValue =
        name === "categoria_id" || name === "stock"
          ? parseInt(value, 10) || 0 // Usamos parseInt solo para los campos numéricos
          : value;
      setFormInventory((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await handleProduct(formInventory);
      handleClose();
    } catch (error) {
      setError(error.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {isExistingProduct ? "Añadir Stock" : "Agregar Nuevo Producto"}
          </h2>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-banner">{error}</div>}
          <div className="form-group">
            <label htmlFor="nombre_producto">Nombre del Producto</label>
            <input
              id="nombre_producto"
              type="text"
              name="nombre_producto"
              value={formInventory.nombre_producto}
              onChange={handleChange}
              //Que hace readOnly
              readOnly={isExistingProduct}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="codigo_producto">Código del Producto</label>
            <input
              id="codigo_producto"
              list="product-codes"
              type="text"
              name="codigo_producto"
              value={formInventory.codigo_producto}
              onChange={handleChange}
              autoComplete="off"
              required
            />
            <datalist id="product-codes">
              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.codigo_producto}
                ></option>
              ))}
            </datalist>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoria_id">Categoría</label>
              <select
                id="categoria_id"
                name="categoria_id"
                value={formInventory.categoria_id}
                onChange={handleChange}
                disabled={isExistingProduct}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.categoryname}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="stock">
                {isExistingProduct ? "Stock a Añadir" : "Stock Inicial"}
              </label>
              <input
                id="stock"
                type="number"
                name="stock"
                value={formInventory.stock}
                onChange={handleChange}
                min={isExistingProduct ? "1" : "0"}
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
              value={formInventory.fecha_entrada}
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
              {isSubmitting
                ? "Agregando..."
                : isExistingProduct
                ? "Añadir Stock"
                : "Agregar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
