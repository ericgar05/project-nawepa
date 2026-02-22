import { useState } from "react";
import "../styles/AddProductModal.css";
import { useInventory } from "./contexts/InventoryContext";

function AddProductModal({ isOpen, onClose }) {
  const { handleProduct, categorias, products } = useInventory();
  console.log("Productos disponibles:", products);

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
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredNames, setFilteredNames] = useState([]);

  // Get unique product names
  const uniqueNames = [...new Set(products.map((p) => p.nombre_producto))];

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setFormInventory(initialState);
    setError(null);
    setIsExistingProduct(false); // <-- AÑADIR ESTA LÍNEA
    onClose();
  };

  // Función simple para generar código basado en el nombre
  const generateProductCode = (name) => {
    if (!name) return "";
    const prefix = name.substring(0, 3).toUpperCase();
    const cleanName = prefix.replace(/[^A-Z]/g, "X");
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 dígitos
    return `${cleanName}-${randomNum}`;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "nombre_producto") {
      value = value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === "stock") {
      value = value.replace(/\D/g, "");
    }

    //Cambiando la logica con respecto a los productos
    if (name === "nombre_producto") {
      const existingProduct = products.find((p) => p.nombre_producto === value);
      console.log("Lo que tiene en esta variable es:", existingProduct);
      if (existingProduct) {
        setFormInventory((prev) => ({
          ...prev,
          nombre_producto: existingProduct.nombre_producto,
          categoria_id: existingProduct.categoria_id,
          codigo_producto: existingProduct.codigo_producto, // <-- CORRECCIÓN AQUÍ
          stock: 0,
        }));
        console.log(categorias);
        setIsExistingProduct(true);
      } else {
        // Si no existe, limpiamos los campos relacionados (excepto el código que se está escribiendo)
        // GENERACIÓN AUTOMÁTICA DEL CÓDIGO AQUÍ:
        const autoCode = generateProductCode(value);

        setFormInventory((prev) => ({
          ...prev,
          nombre_producto: value,
          codigo_producto: autoCode, // Auto-set code
          categoria_id: "",
        }));
        setIsExistingProduct(false);
      }
    } else {
      // Para cualquier otro campo, actualizamos el estado normalmente
      const newValue =
        name === "categoria_id" || name === "stock"
          ? parseInt(value, 10) || ""
          : value;
      setFormInventory((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    if (name === "nombre_producto") {
      const filtered = uniqueNames.filter((n) =>
        n.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredNames(filtered);
      setShowDropdown(true);
    }
  };

  const handleNameSelect = (name) => {
    handleChange({ target: { name: "nombre_producto", value: name } });
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // --- INICIO DE LA VALIDACIÓN ---
    // Si estamos creando un producto nuevo (no actualizando stock)
    if (!isExistingProduct) {
      const codeExists = products.some(
        (p) => p.codigo_producto === formInventory.codigo_producto,
      );
      if (codeExists) {
        setError(
          "El código de producto ya está en uso. Por favor, elige otro.",
        );
        setIsSubmitting(false);
        return; // Detenemos el envío del formulario
      }
    }
    // --- FIN DE LA VALIDACIÓN ---

    try {
      await handleProduct(formInventory);
      window.alert("el producto ha sido guardado correctamente");
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
          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="nombre_producto">Nombre del Producto</label>
            <input
              id="nombre_producto"
              type="text"
              name="nombre_producto"
              className="custom-dropdown-input"
              value={formInventory.nombre_producto}
              onChange={handleChange}
              onFocus={() => {
                setFilteredNames(uniqueNames);
                setShowDropdown(true);
              }}
              onBlur={() => {
                setShowDropdown(false);
              }}
              readOnly={isExistingProduct}
              autoComplete="off"
              required
            />
            {showDropdown && !isExistingProduct && filteredNames.length > 0 && (
              <ul className="custom-dropdown-list">
                {filteredNames.map((nombre, idx) => (
                  <li
                    key={idx}
                    onMouseDown={() => handleNameSelect(nombre)}
                    className="custom-dropdown-item"
                  >
                    {nombre}
                  </li>
                ))}
              </ul>
            )}
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
