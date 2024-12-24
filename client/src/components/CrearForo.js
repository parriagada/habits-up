import React, { useState } from 'react';
import { crearForo } from '../utils/foroUtils';

function CrearForo({ onForoCreado }) {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reiniciar el error

    try {
      const nuevoForo = await crearForo(titulo, contenido);
      onForoCreado(nuevoForo); // Notificar al componente padre que se creó un foro
      setTitulo('');
      setContenido('');
    } catch (error) {
      setError(error.message); // Captura el mensaje de error
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Foro</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contenido">Contenido:</label>
          <textarea
            id="contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}

export default CrearForo;