import React from 'react';
import './styles/Footer.css';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import ContadorVisitas from './ContadorVisitas';

const Footer = ({ token }) => {
  return (
    <footer className="footer">
      {!token && (
        <div className="footer__contact">
          <div className="footer__item">
            <FaEnvelope className="footer__icon" />
            <a href="mailto:csantelicesf@unemi.edu.ec">csantelicesf@unemi.edu.ec</a>
          </div>
          <div className="footer__item">
            <FaPhone className="footer__icon" />
            <a href="tel:+15551234567">+1 (555) 123-4567</a>
          </div>
        </div>
      )}
      <div className="footer__text">
        Desarrollado por Cristian Noe Santelices Farez
      </div>
      {!token && (
        <div className="footer__contador">
          <ContadorVisitas />
        </div>
      )}
    </footer>
  );
};

export default Footer;
