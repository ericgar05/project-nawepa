import { useState } from "react";

import { useAuth } from "./contexts/AuthContext";
import "../styles/Login.css";
import logoNawepa from "../assets/logo.png"; // 1. Importar el logo

function Login() {
  const { handleLogin } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    password: "",
  });

  const [cargando, setCargando] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(false); // 2. Poner en estado de carga
    try {
      await handleLogin(formData);
      // Si el login es exitoso, el AuthProvider se encarga de redirigir.
    } catch (error) {
      // 3. Si hay un error (credenciales incorrectas), se captura aquí.
      console.error("Fallo el inicio de sesión:", error);
      setCargando(false); // 4. Se resetea el estado para permitir volver a escribir.
    }
  };

  return (
    <div className="login-container">
      <section className="login-content">
        <img src={logoNawepa} alt="Logo de Nawepa" className="login-logo" />
        <h1>Iniciar Sesión</h1>

        <form className="form-user" onSubmit={handleSubmit}>
          <label>
            Usuario
            <input
              type="text"
              name="nombre"
              placeholder="Usuario"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={cargando}
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={cargando}
            />
          </label>

          <button type="submit" className="login-buttom" disabled={cargando}>
            {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Login;
