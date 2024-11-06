import React, { useState } from 'react';
import './Registro.css';

function Registro() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [erroresContrasena, setErroresContrasena] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errores = validarContrasena(contrasena);
    setErroresContrasena(errores);

    if (Object.keys(errores).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/usuarios/registrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: nombreUsuario,
            email: correoElectronico,
            contrasena: contrasena,
          }),
        });

        if (response.ok) {
          window.location.href = '/login';
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Ocurrió un error al registrar el usuario.');
      }
    }
  };

  const validarContrasena = (contrasena) => {
    const errores = {};

    // Verifica la longitud
    if (contrasena.length < 8) {
      errores.longitud = 'La contraseña debe tener al menos 8 caracteres.';
    }

    // Verifica que contenga al menos una letra mayúscula
    if (!/[A-Z]/.test(contrasena)) {
      errores.mayuscula = 'La contraseña debe contener al menos una letra mayúscula.';
    }

    // Verifica que contenga al menos una letra minúscula
    if (!/[a-z]/.test(contrasena)) {
      errores.minuscula = 'La contraseña debe contener al menos una letra minúscula.';
    }

    // Verifica que contenga al menos un número
    if (!/\d/.test(contrasena)) {
      errores.numero = 'La contraseña debe contener al menos un número.';
    }

    // Verifica que contenga al menos un carácter especial
    if (!/[@$!%*?&]/.test(contrasena)) {
      errores.especial = 'La contraseña debe contener al menos un carácter especial (@$!%*?&).';
    }

    return errores;
  };

  return (
    <div className="contenedor-registro">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombreUsuario">Nombre de usuario:</label>
          <input
            type="text"
            id="nombreUsuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />
        </div>
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
            onChange={(e) => {
              setContrasena(e.target.value);
              setErroresContrasena(validarContrasena(e.target.value)); // Actualiza los errores al escribir
            }}
            required
          />
          {/* Mostrar errores de contraseña */}
          {Object.keys(erroresContrasena).map((key) => (
            <p key={key} className="error-contrasena">
              {erroresContrasena[key]}
            </p>
          ))}
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;
