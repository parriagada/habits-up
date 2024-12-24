import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { obtenerForoPorId, editarForo, eliminarForo } from '../utils/foroUtils'; // Todavía no existen
 import EditarForo from './EditarForo';
import { set } from 'mongoose';

function ForoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foro, setForo] = useState(null);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState(null);
  const { esAdmin } = useContext(UserContext);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchForo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/foros/${id}`);
        if (response.ok) {
          const data = await response.json();
          setForo(data);
        } else {
          setError('Foro no encontrado');
          // Considerar redirigir al usuario a la lista de foros o a una página de error 404
          // navigate('/foros');
        }
      } catch (error) {
        setError('Error al cargar el foro');
      }
    };

    fetchForo();
  }, [id]);

  const handleEliminar = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este foro?')) {
      try {
        const response = await fetch(`${BASE_URL}/foros/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          navigate('/foros'); // Redirigir al usuario a la lista de foros después de eliminar
        } else {
          setError('Error al eliminar el foro');
        }
      } catch (error) {
        setError('Error al eliminar el foro');
      }
    }
  };

  const handleEditar = () => {
    setEditando(true);
  };

  const handleForoEditado = (foroEditado) => {
    setEditando(false);
    // Actualizar el estado 'foro' con los nuevos valores
    setForo(foroEditado); 
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!foro) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>{foro.titulo}</h1>
      <p>
        Por: {foro.autor.nombre} - Fecha:{' '}
        {new Date(foro.fechaCreacion).toLocaleDateString()}
      </p>{' '}
      {/* Ajusta según cómo quieras mostrar al autor y la fecha */}
      <div>{foro.contenido}</div>
      {esAdmin && !editando && (
        <div>
          <button onClick={handleEditar}>Editar</button>
          <button onClick={handleEliminar}>Eliminar</button>
        </div>
      )}
      {editando && (
        <EditarForo
          foro={foro}
          foroId={id}
          onForoEditado={handleForoEditado}
        />
      )}
    </div>
  );
}

export default ForoDetalle;