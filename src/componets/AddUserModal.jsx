import { useState } from "react";

function AddUserModal({ isOpen, onClose, niveles }) {
  // Eliminamos onAddUser
  const initialState = {
    username: "",
    password: "",
    nivel_id: "",
  };

  const [formUser, setFormUser] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setFormUser(initialState);
    setError(null);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si el campo es 'nivel_id', nos aseguramos de que el valor sea un número.
    const processedValue = name === "nivel_id" ? parseInt(value, 10) : value;

    setFormUser((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const userDataToSend = {
        username: formUser.username,
        password: formUser.password, // Sin encriptar por ahora
        nivel_id: formUser.nivel_id,
      };
      console.log("📤 Enviando datos al servidor:", userDataToSend);

      console.log("🔄 Intentando conectar con servidor...");

      const response = await fetch("http://localhost:4000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDataToSend),
      });

      // Si llegamos aquí, la conexión SÍ se estableció
      console.log("✅ Conexión establecida, estado:", response.status);

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || responseData.detalle || "Error del servidor"
        );
      }

      console.log("✅ Usuario creado exitosamente");
      handleClose();
    } catch (error) {
      console.error("❌ Error completo:", error);

      // Manejo específico de errores de conexión
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setError(
          "No se pudo conectar con el servidor. Verifica que esté ejecutándose en el puerto 4000."
        );
      } else {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Añadir Nuevo Usuario</h2>
          <button className="close-button" onClick={handleClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formUser.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formUser.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nivel_id">Nivel de Usuario</label>
            <select
              id="nivel_id"
              name="nivel_id"
              value={formUser.nivel_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un nivel</option>
              {niveles?.map((nivel) => (
                <option
                  key={nivel.id}
                  value={nivel.id}
                  title={nivel.levelsdescription}
                >
                  {nivel.levelsname}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn-primario"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Añadiendo..." : "Añadir Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;
