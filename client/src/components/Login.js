import React, { useState } from 'react';
import './Login.css';


function Login() {
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');
  const BASE_URL = process.env.REACT_APP_BACKEND_URL
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/usuarios/login`, { // Ajusta la ruta si es necesario
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
        localStorage.setItem('token', data.token); 


        // Redirige al usuario a la página principal u otra página protegida
        window.location.href = '/habitos'; 
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
    <div className="contenedor-login">
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
        
        <div>
          ¿No tienes una cuenta? <a href="/registro">Regístrate aquí</a>
        </div>
        

        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );

}

export default Login;
