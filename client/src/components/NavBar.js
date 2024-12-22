import React, { useState, useEffect } from 'react';
import './NavBar.css';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const generateTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/habitos':
        return 'HabitsUp | Hábitos';
      case '/pomodoro':
        return 'HabitsUp | Pomodoro';
      case '/comunidad':
        return 'HabitsUp | Comunidad';
      case '/perfil':
        return 'HabitsUp | Perfil';
      case '/registro':
        return 'HabitsUp | Registro';
      case '/login':
        return 'HabitsUp | Iniciar Sesión';
      default:
        return 'HabitsUp';
    }
  };

  useEffect(() => {
    document.title = generateTitle();
  }, [location]);

  return (
    <nav className="navbar">
      <div className="nav-mobile">
        <div className="logo">HabitsUp</div>
        <button className="menu-toggle" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
      </div>
      <ul className={`nav-list ${isMenuOpen ? 'open' : ''}`}>
        {/* Opciones para usuarios autenticados */}
        <li>
          <Link to="/habitos" className={isLoggedIn ? '' : 'disabled'} onClick={() => setIsMenuOpen(false)}>
            Hábitos
          </Link>
        </li>
        <li>
          <Link to="/pomodoro" className={isLoggedIn ? '' : 'disabled'} onClick={() => setIsMenuOpen(false)}>
            Pomodoro
          </Link>
        </li>
        <li>
          <Link to="/comunidad" className={isLoggedIn ? '' : 'disabled'} onClick={() => setIsMenuOpen(false)}>
            Comunidad
          </Link>
        </li>
        <li>
          <Link to="/perfil" className={isLoggedIn ? '' : 'disabled'} onClick={() => setIsMenuOpen(false)}>
            Perfil
          </Link>
        </li>

        {isLoggedIn && (
          <li>
            <Link to="/login" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>Cerrar sesión</Link>
          </li>
        )}
        {/* Opciones solo para usuarios no autenticados */}
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/registro" onClick={() => setIsMenuOpen(false)}>Registro</Link>
            </li>
            <li>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Iniciar sesión</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;