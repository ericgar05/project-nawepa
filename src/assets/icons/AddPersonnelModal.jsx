import React, { useState } from "react";
import "../styles/AddProductModal.css"; // Reutilizamos estilos existentes

function AddPersonnelModal({ isOpen, onClose }) {
  const initialState = {
    nombre: "",
    apellido: "",
    sueldo: "",
    cargo: "",
  };

  const [formPersonnel, setFormPersonnel] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setFormPersonnel(initialState);
    setError(null);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormPersonnel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/personal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPersonnel),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Error al añadir el empleado.");
      }

      handleClose();
      // Opcional: podrías tener una función para refrescar la lista de personal
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Añadir Nuevo Empleado</h2>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-banner">{error}</div>}
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formPersonnel.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              type="text"
              name="apellido"
              value={formPersonnel.apellido}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cargo">Cargo</label>
              <input
                id="cargo"
                type="text"
                name="cargo"
                value={formPersonnel.cargo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sueldo">Sueldo</label>
              <input
                id="sueldo"
                type="number"
                name="sueldo"
                value={formPersonnel.sueldo}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <button
              type="submit"
              className="btn-primario"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Añadiendo..." : "Añadir Empleado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPersonnelModal;
