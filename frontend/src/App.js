import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import RegisterForm from './components/RegisterForm';
import Login from './components/LoginForm';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import CrearEncuesta from './components/CrearEncuesta';
import MisEncuestas from './components/MisEncuestas'; 
import EditarEncuesta from './components/EditarEncuesta';
import VistaPrevia from './components/VistaPrevia';
import ResponderEncuesta from './components/ResponderEncuesta';
import ResultadosEncuesta from './components/Resultados';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

function App() {
  // Estado para almacenar el token de autenticación
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Funcion para manejar el inicio de sesión y guardar el token
  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  // Funcion para cerrar sesión
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('apellido');
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Header token={token} onLogout={handleLogout} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/encuestas/:id_unico/responder" element={<ResponderEncuesta />} /> 
            {/* Rutas protegidas */}
            {token ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/crear-encuesta" element={<CrearEncuesta />} />
                <Route path="/mis-encuestas" element={<MisEncuestas />} /> 
                <Route path="/editar-encuesta/:id" element={<EditarEncuesta/>} />
                <Route path="/vista-previa/:id" element={<VistaPrevia />} />
                <Route path="/encuestas/:encuesta_id/resultados" element={<ResultadosEncuesta />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" />} />
            )}
          </Routes>
        </div>
        <Footer token={token}/>
      </BrowserRouter>
    </div>
  );
}

export default App;
