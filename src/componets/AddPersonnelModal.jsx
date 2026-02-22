import { useState } from "react";
import "../styles/AddProductModal.css"; // Importamos los estilos del modal

function AddPersonnelModal({ isOpen, onClose }) {
  const initialState = {
    nombre: "",
    apellido: "",
    cargo: "",
    cedula: "",
    telefono: "",
    correo: "",
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
    let { name, value } = e.target;

    if (name === "nombre" || name === "apellido" || name === "cargo") {
      value = value.replace(/[^A-Za-záéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === "cedula") {
      value = value.replace(/\D/g, "");
      // Limitar a máximo 8 caracteres
      if (value.length > 8) value = value.slice(0, 8);
    } else if (name === "telefono") {
      value = value.replace(/\D/g, "");
      if (value.length > 11) value = value.slice(0, 11);
    }

    setFormPersonnel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validación de cédula (exactamente 8 números)
    if (formPersonnel.cedula.length !== 8) {
      setError("La cédula debe tener exactamente 8 números.");
      setIsSubmitting(false);
      return;
    }

    // Validación de teléfono (exactamente 11 números)
    if (formPersonnel.telefono.length !== 11) {
      setError("El teléfono debe tener exactamente 11 números.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/personal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPersonnel),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || "Error desconocido al añadir personal.",
        );
      }

      console.log("Personal añadido con éxito:", responseData);
      window.alert("el personal ha sido guardado correctamente");
      handleClose();
    } catch (error) {
      // Mostramos el error directamente en el modal
      setError(error.message || "Ocurrió un error al añadir el personal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Añadir Nuevo Personal</h2>
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
          <div className="form-group">
            <label htmlFor="cedula">Cédula</label>
            <input
              id="cedula"
              type="text"
              name="cedula"
              value={formPersonnel.cedula}
              onChange={handleChange}
              placeholder="Ej. 12345678"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="text"
              name="telefono"
              value={formPersonnel.telefono}
              onChange={handleChange}
              placeholder="Ej. 04141234567"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={formPersonnel.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-primario"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Añadiendo..." : "Añadir Personal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPersonnelModal;
