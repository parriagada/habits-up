import React, { useState, useEffect } from 'react';

function EditarForo({ foro, foroId, onForoEditado }) {
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [error, setError] = useState(null);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (foro) {
      setTitulo(foro.titulo);
      setContenido(foro.contenido);
    }
  }, [foro]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/foros/${foroId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ titulo, contenido }),
      });

      if (response.ok) {
        const data = await response.json();
        onForoEditado(data); // Notificar al componente padre que se editó el foro
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al editar el foro');
      }
    } catch (error) {
      setError('Error al editar el foro');
    }
  };

  return (
    <div>
      <h2>Editar Foro</h2>
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
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditarForo;