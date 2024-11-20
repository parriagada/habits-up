import React, { useState, useEffect } from 'react';

function Pomodoro() {
  const [concentracion, setConcentracion] = useState(25); // Valor por defecto: 25 minutos.
  const [descanso, setDescanso] = useState(5); // Valor por defecto: 5 minutos.
  const [numDescansos, setNumDescansos] = useState(4); // Valor por defecto: 4 descansos.


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirigir al login si no está autenticado
        window.location.href = '/login'; 
        return;
      }

      const response = await fetch('http://localhost:5000/pomodoros', {  // Ruta para el backend, a crear.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          concentracion,
          descanso,
          numDescansos,
        }),
      });

      if (response.ok) {
        // Lógica después de guardar con éxito, tal vez mostrar un mensaje
        console.log('Pomodoro guardado con éxito.');
      } else {
        // Manejo de errores
        const errorData = await response.json();
        console.error('Error al guardar el pomodoro:', errorData.message);
      }
    } catch (error) {
      console.error('Error al guardar pomodoro:', error);
    }
  };

  return (
    <div>
      <h2>Pomodoro</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="concentracion">Tiempo de Concentración (minutos):</label>
        <input
          type="number"
          id="concentracion"
          value={concentracion}
          onChange={(e) => setConcentracion(parseInt(e.target.value, 10))}
          min="1" // Valor mínimo
          required
        />

        <label htmlFor="descanso">Tiempo de Descanso (minutos):</label>
        <input
          type="number"
          id="descanso"
          value={descanso}
          onChange={(e) => setDescanso(parseInt(e.target.value, 10))}
          min="1"  // Valor mínimo
          required
        />

        <label htmlFor="numDescansos">Número de Descansos:</label>
        <input
          type="number"
          id="numDescansos"
          value={numDescansos}
          onChange={(e) => setNumDescansos(parseInt(e.target.value, 10))}
          min="1" // Valor mínimo
          required
        />

        <button type="submit">Iniciar Pomodoro</button>
      </form>
    </div>
  );
}

export default Pomodoro;