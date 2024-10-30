import React, { useState, useEffect } from 'react';

function Habitos() {
  const [habitos, setHabitos] = useState([]);
  const [nuevoHabito, setNuevoHabito] = useState('');

  useEffect(() => {
    const obtenerHabitos = async () => {
      try {
        const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local
        if (!token) {
          // Manejar caso si no hay token, redirigir al login, etc.
          console.error('No hay token de autenticación.');
          return;
        }

        const response = await fetch('http://localhost:5000/habitos', {
          headers: {
            'Authorization': `Bearer ${token}`, // Incluye el token en el header Authorization
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHabitos(data);
        } else {
          // Manejo de errores, muestra un mensaje al usuario
          const errorData = await response.json();
          console.error('Error al obtener hábitos:', errorData.message);
          // Puedes mostrar un mensaje de error al usuario aquí
        }
      } catch (error) {
        console.error('Error al obtener hábitos:', error);
        // Puedes mostrar un mensaje de error al usuario aquí
      }
    };

    obtenerHabitos();
  }, []);

  const agregarHabito = async () => {
    // ... lógica para enviar el nuevo hábito al backend
    try {
      const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local
      if (!token) {
        // Manejar caso si no hay token, redirigir al login, etc.
        console.error('No hay token de autenticación.');
        return;
      }

      const response = await fetch('http://localhost:5000/habitos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluye el token en el header Authorization
        },
        body: JSON.stringify({
          // ... datos del nuevo hábito, incluyendo el ID del usuario
          nombre: nuevoHabito,
        }),
      });

      if (response.ok) {
        // Habito agregado con éxito, actualiza la lista de hábitos
        const nuevoHabitoCreado = await response.json();
        setHabitos([...habitos, nuevoHabitoCreado]);
        setNuevoHabito('');
      } else {
        // Manejo de errores, muestra un mensaje al usuario
        const data = await response.json();
        alert(data.message || 'Error al agregar el hábito');
      }
    } catch (error) {
      console.error('Error al agregar el hábito:', error);
      alert('Ocurrió un error al agregar el hábito.');
    }
  };

  return (
    <div>
      <h2>Mis Hábitos</h2>
      <ul>
        {habitos.map((habito) => (
          <li key={habito._id}>{habito.nombre}</li> // Ajusta la propiedad 'nombre' si es necesario
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Nuevo hábito"
          value={nuevoHabito}
          onChange={(e) => setNuevoHabito(e.target.value)}
        />
        <button onClick={agregarHabito}>Agregar</button>
      </div>
    </div>
  );
}

export default Habitos;
