import React, { useState, useEffect } from "react";
import "../styles/Resume.css"; // Reutilizamos los estilos que ya existen
import { IconAdd } from "../assets/icons/Icons";

function PersonalPanel({ onAddPersonnelClick }) {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const response = await fetch("http://localhost:4000/personal");
        const data = await response.json();
        if (response.ok) {
          setPersonal(data);
        } else {
          console.error("Error al cargar el personal:", data.error);
        }
      } catch (error) {
        console.error("Error de red al cargar el personal:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonal();
  }, []);

  return (
    <div className="personal-panel">
      <div className="panel-header">
        <h2>Resumen de Personal</h2>
        <p className="panel-subtitle">Visión general de tu equipo</p>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="personal-stats">
          <div className="personal-stat">
            <span className="stat-valor">{personal.length}</span>
            <span className="stat-label">Total Empleados</span>
          </div>
        </div>
      )}
      <button className="btn-primario" onClick={onAddPersonnelClick}>
        + Añadir Empleado
      </button>
    </div>
  );
}

export default PersonalPanel;
