import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { crearForo } from '../utils/foroUtils';
import CrearForo from '../components/CrearForo'; // Asegúrate de que este componente existe

function Foros() {
  const [foros, setForos] = useState([]);
  const [mostrandoFormularioCreacion, setMostrandoFormularioCreacion] = useState(false);
  const { esAdmin } = useContext(UserContext);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const obtenerForos = async () => {
      try {
        const response = await fetch(`${BASE_URL}/foros`);
        if (response.ok) {
          const data = await response.json();
          setForos(data);
        } else {
          console.error('Error al obtener los foros');
        }
      } catch (error) {
        console.error('Error al obtener los foros:', error);
      }
    };

    obtenerForos();
  }, []);

  const handleForoCreado = (nuevoForo) => {
    setForos([nuevoForo, ...foros]); // Agrega el nuevo foro al principio de la lista
    setMostrandoFormularioCreacion(false); // Oculta el formulario
  };

  return (
    <div>
      <h1>Foros</h1>

      {esAdmin && (
        <button onClick={() => setMostrandoFormularioCreacion(true)}>
          Crear Foro
        </button>
      )}

      {mostrandoFormularioCreacion && (
        <CrearForo onForoCreado={handleForoCreado} />
      )}

      <ul>
        {foros.map((foro) => (
          <li key={foro._id}>
            <Link to={`/foros/${foro._id}`}>{foro.titulo}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Foros;