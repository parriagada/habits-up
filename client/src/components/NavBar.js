import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom'; 

function Navbar() {
  const isLoggedIn = !!localStorage.getItem('token'); // Verifica si el token existe

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    window.location.href = '/login'; // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <nav className="navbar">
      <div className="nav-mobile">
        <div className="logo">HabitsUp</div>
        <div className="menu-toggle">
          <i className="fas fa-bars"></i>
        </div>
      </div>
      <ul className="nav-list">
        {/* Opciones para usuarios autenticados e invitados */}
        <li>
          <Link to="/habitos" className={isLoggedIn ? '' : 'disabled'}>
            Hábitos
          </Link>
        </li>
        <li>
          <Link to="/pomodoro" className={isLoggedIn ? '' : 'disabled'}>
            Pomodoro
          </Link>
        </li>
        <li>
          <Link to="/comunidad" className={isLoggedIn ? '' : 'disabled'}>
            Comunidad
          </Link>
        </li>
        <li>
          <Link to="/perfil" className={isLoggedIn ? '' : 'disabled'}>
            Perfil
          </Link>
        </li>

        {isLoggedIn && (
          <li>
            <button onClick={handleLogout}>Cerrar sesión</button>
          </li>
        )}
        {/* Opciones solo para usuarios no autenticados */}
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/registro">Registro</Link>
            </li>
            <li>
              <Link to="/login">Iniciar sesión</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;