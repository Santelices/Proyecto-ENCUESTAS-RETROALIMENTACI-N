import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Header.css';

const Header = ({ token, onLogout }) => {
  const navigate = useNavigate();
  const nombre = localStorage.getItem('nombre');
  const apellido = localStorage.getItem('apellido');

  const handleLogoClick = () => {
    if (!token) {
      navigate('/'); 
    }
  };

  return (
    <header className="header">
      <div className="header__logo" onClick={handleLogoClick} style={{ cursor: !token ? 'pointer' : 'default' }}>        
        <img src={`${process.env.PUBLIC_URL}/EncRetro.ico`} alt="EnRetro Icon" className="logo" />
        <span className="header__title">EncRetro</span>
      </div>
      <nav className="header__nav">
        {token ? (
          <>
            <span className="nav__user">
              Bienvenido, {nombre} {apellido} 
            </span>
            <button onClick={onLogout} className="nav__button">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav__link">Inicio Sesión</Link>
            <Link to="/register" className="nav__button">Regístrate</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
