import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavBar from './components/NavBar'
import Registro from './components/Registro';
import Login from './components/Login';
import Habitos from './components/Habitos';
import HabitoDetalle from './components/HabitoDetalle';
import Pomodoro from './components/Pomodoro';

import { jwtDecode } from 'jwt-decode';

function App() {
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        console.log('Token expired');
        localStorage.removeItem('token');
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Routes>
        <Route path="/" element={isLoggedIn() ? <Navigate to="/habitos" /> : <Navigate to="/login" />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/habitos" element={isLoggedIn() ? <Habitos /> : <Navigate to="/login" />} />
          <Route path="/habitos/:habitoId" element={isLoggedIn() ? <HabitoDetalle /> : <Navigate to="/login" />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;