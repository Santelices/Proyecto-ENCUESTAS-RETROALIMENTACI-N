import React, { useState } from 'react';
import './styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });
      const token = response.data.access_token;
      const { nombre, apellido } = response.data.usuario;
      localStorage.setItem('token', token);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('apellido', apellido);
      onLogin(token); 
      navigate('/dashboard'); 
    } catch (error) {
      setMessage('Error en el inicio de sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Inicia Sesión</h1>
        <p className="login-subtitle">Accede a tu cuenta y crea encuestas rápidamente.</p>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Iniciar sesión</button>
        </form>
        {message && <p className="error-message">{message}</p>}
        <p className="register-link">¿No tienes una cuenta? <Link to="/register">Crea tu cuenta</Link></p>
      </div>
    </div>
  );
}

export default Login;
