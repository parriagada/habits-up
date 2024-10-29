import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registro from './components/Registro';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        {/* Otras rutas de la aplicación */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;