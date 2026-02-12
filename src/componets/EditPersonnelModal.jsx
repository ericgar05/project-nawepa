import { useState, useEffect } from "react";
import "../styles/AddProductModal.css"; // Reusing styles

function EditPersonnelModal({ isOpen, onClose, employee, onUpdate }) {
  const [formPersonnel, setFormPersonnel] = useState({
    nombre: "",
    apellido: "",
    cargo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employee) {
      setFormPersonnel({
        nombre: employee.nombre,
        apellido: employee.apellido,
        cargo: employee.cargo,
      });
    }
  }, [employee]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
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
      const response = await fetch(
        `http://localhost:4000/personal/${employee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formPersonnel),
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || "Error desconocido al actualizar personal.",
        );
      }

      console.log("Personal actualizado con éxito:", responseData);
      onUpdate(responseData.updatedPersonnel); // Notify parent component
      handleClose();
    } catch (error) {
      setError(error.message || "Ocurrió un error al actualizar el personal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Personal</h2>
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

export default EditPersonnelModal;
