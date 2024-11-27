import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar'
import Registro from './components/Registro';
import Login from './components/Login';
import Habitos from './components/Habitos';
import HabitoDetalle from './components/HabitoDetalle';
import Pomodoro from './components/Pomodoro';

function App() {
   const isLoggedIn = !!localStorage.getItem('token');
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/habitos"
            element={isLoggedIn ? <Habitos /> : <Navigate to="/login" />}
          />
          <Route
            path="/habitos/:habitoId"
            element={isLoggedIn ? <HabitoDetalle /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={isLoggedIn ? '/habitos' : '/registro'} />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;