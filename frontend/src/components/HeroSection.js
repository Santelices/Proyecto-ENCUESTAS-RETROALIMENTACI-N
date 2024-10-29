import React from 'react';
import './styles/HeroSection.css';
import heroImage from '../assets/enRetro.webp'; // Aquí pones tu imagen
import { FaUserCheck, FaClipboardList, FaShareAlt } from 'react-icons/fa';

function HeroSection() {
  return (
    <section className="hero">
          <h1 className="hero__title">Crea encuestas en línea fácilmente</h1>
      <div className="hero__content">
        <div className="hero__description">
          <h2 className="hero__subtitle">¿Cómo lo haces?</h2>
          <ul className="hero__list">
            <li><FaUserCheck className="hero__icon" /> <strong>Regístrate</strong> en pocos segundos.</li>
            <li><FaClipboardList className="hero__icon" /> <strong>Crea tu encuesta</strong> fácilmente.</li>
            <li><FaShareAlt className="hero__icon" /> <strong>Visualiza los resultados</strong> y toma tus decisiones.</li>
          </ul>
        </div>
        <div className="hero__image">
          <img src={heroImage} alt="Persona usando un laptop para crear encuestas" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
