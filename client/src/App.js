import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'
import Registro from './components/Registro';
import Login from './components/Login';
import Habitos from './components/Habitos';

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Routes>
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path='/habitos' element={<Habitos />} />       
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;