import React from 'react';
import './NavBar.css';

function Navbar() {
  return (
    <nav className="navbar"> 
        <div className="nav-mobile"> 
            <div className="logo">Habits Up</div>
            <div className="menu-toggle"> 
                <i className="fas fa-bars"></i> 
            </div>
        </div>
        <ul className="nav-list">
            <li><a href="/habitos">Hábitos</a></li>
            <li><a href="/pomodoro">Pomodoro</a></li>
            <li><a href="/noticias">Noticias</a></li>
            <li><a href="/comunidad">Comunidad</a></li>
            <li><a href="/perfil">Perfil</a></li>
        </ul>
    </nav>
  );
}

export default Navbar;
