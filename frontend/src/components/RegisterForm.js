import React, { useState } from 'react';
import './styles/RegisterForm.css';
import { Link } from "react-router-dom";
import axios from 'axios';

function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  });
  
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://encretro.onrender.com/register', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error en el registro. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Crea una cuenta</h1>
        <p className="register-subtitle">Es rápido, facil y gratis.</p>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-inputs">
            <input 
              type="text" 
              name="nombre" 
              placeholder="Nombre" 
              className="input-field" 
              value={formData.nombre}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              name="apellido" 
              placeholder="Apellido" 
              className="input-field" 
              value={formData.apellido}
              onChange={handleChange}
              required 
            />
          </div>
          <input 
            type="email" 
            name="email" 
            placeholder="Correo electrónico" 
            className="input-field" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Contraseña" 
            className="input-field" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <button type="submit" className="register-button">Registrarte</button>
        </form>
        {message && <p className="register-message">{message}</p>}
        <p className="login-link">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}

export default RegisterForm;
