import { useState } from "react";

import { useAuth } from "./contexts/AuthContext";
import "../styles/Login.css";
import logoNawepa from "../assets/logo.png"; // Importamos el logo

function Login() {
  //const navigate = useNavigate();

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
    handleLogin(formData);
    setCargando(true);
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

          <button className="login-buttom" type="submit" disabled={cargando}>
            {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Login;
