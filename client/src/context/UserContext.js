import React, { createContext, useState, useEffect } from 'react';
import { obtenerInformacionUsuario } from '../utils/api';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const usuarioData = await obtenerInformacionUsuario();
      if (usuarioData) {
        setUsuario(usuarioData);
        setEsAdmin(usuarioData.rol === 'administrador');
      }
    };

    fetchData();
  }, []);

  return (
    <UserContext.Provider value={{ usuario, esAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };