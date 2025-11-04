import { useState } from "react";
import "./ProductModal.css";

const ProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    cantidad: "",
    categoria: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre && formData.cantidad && formData.categoria) {
      onAddProduct(formData);
      setFormData({ nombre: "", cantidad: "", categoria: "" });
      onClose();
    }
  };

  const handleCategorySelect = (categoria) => {
    setFormData((prev) => ({ ...prev, categoria }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Agregar Nuevo Producto</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="productName">Nombre del Producto</label>
            <input
              type="text"
              id="productName"
              className="form-control"
              placeholder="Ej. Jabón líquido"
              value={formData.nombre}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nombre: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="productQuantity">Cantidad</label>
            <input
              type="number"
              id="productQuantity"
              className="form-control"
              placeholder="Ej. 50"
              min="1"
              value={formData.cantidad}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cantidad: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <div className="category-selector">
              <div
                className={`category-option limpieza ${
                  formData.categoria === "limpieza" ? "selected" : ""
                }`}
                onClick={() => handleCategorySelect("limpieza")}
              >
                Limpieza
              </div>
              <div
                className={`category-option papeleria ${
                  formData.categoria === "papeleria" ? "selected" : ""
                }`}
                onClick={() => handleCategorySelect("papeleria")}
              >
                Papelería
              </div>
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Agregar Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
