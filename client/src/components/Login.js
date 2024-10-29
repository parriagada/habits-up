import React, { useState } from 'react';

function Login() {
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/usuarios/login', { // Ajusta la ruta si es necesario
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: correoElectronico,
          contrasena,
        }),
      });

      if (response.ok) {
        // Inicio de sesión exitoso
        const data = await response.json();
        console.log(data); // Verifica la respuesta del servidor

        // Guarda los datos del usuario (por ejemplo, un token) en el almacenamiento local
        // localStorage.setItem('token', data.token); // Ajusta según la respuesta del servidor

        // Redirige al usuario a la página principal u otra página protegida
        window.location.href = '/'; 
      } else {
        // Manejo de errores, muestra un mensaje al usuario
        const data = await response.json();
        alert(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error al iniciar sesión.');
    }
  };

  return (
    <div>
      <h2>Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="correoElectronico">Correo electrónico:</label>
          <input
            type="email"
            id="correoElectronico"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="contrasena">Contraseña:</label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login;
