import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useState } from "react";
// import bcrypt from "bcryptjs";

export const AuthProvider = ({ children }) => {
  // 1. Inicializamos el estado intentando leer desde localStorage
  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return !!storedData; // Será true si hay datos, false si no
  });

  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    console.log("Datos de login:", formData);
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Fallo al iniciar sesión: ${data.error || "Error desconocido."}`);
        return;
      }

      if (!data.usuario || !data.usuario.name) {
        alert("Usuario no encontrado en la respuesta del servidor.");
        return;
      }

      // 2. Guardamos los datos en localStorage al hacer login
      localStorage.setItem("userData", JSON.stringify(data.usuario));

      setUserData(data.usuario);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      alert("Error de conexión con el servidor.");
      console.error("Error de red:", error);
    }
  };

  // 3. Creamos una función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userData,
        handleLogin,
        handleLogout, // La exponemos en el contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
