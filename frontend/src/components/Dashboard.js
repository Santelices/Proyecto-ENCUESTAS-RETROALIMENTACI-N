import React from 'react';
import './styles/Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Bienvenido a EncRetro</h2>
      <p className="dashboard-subtitle">Crea, gestiona y comparte encuestas de forma sencilla.</p>
      <div className="dashboard-buttons">
        <Link to="/crear-encuesta" className="dashboard__button">Crear Nueva Encuesta</Link>
        <Link to="/mis-encuestas" className="dashboard__button">Ver Mis Encuestas</Link>
      </div>
    </div>
  );
};

export default Dashboard;
