import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="hamburger-icon" onClick={toggleMenu}>
          <div className={`hamburger-line ${isOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${isOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${isOpen ? 'open' : ''}`}></div>
        </div>
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {t(language, 'home')}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/rental-agreement" 
              className={`nav-link ${location.pathname === '/rental-agreement' ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {t(language, 'rentalAgreement')}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/pricing" 
              className={`nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {t(language, 'pricing')}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
