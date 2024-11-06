import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar'
import Registro from './components/Registro';
import Login from './components/Login';
import Habitos from './components/Habitos';
import HabitoDetalle from './components/HabitoDetalle';

function App() {
  const isLoggedIn = !!localStorage.getItem('token'); // Verifica si el token existe

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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;