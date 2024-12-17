import React, { useState, useEffect } from 'react';
import './Habitos.css';


function Pomodoro() {
  const [tiempoRestante, setTiempoRestante] = useState(25 * 60 * 1000); // milliseconds
  const [estado, setEstado] = useState('pausado');
  const [intervalo, setIntervalo] = useState(null);
  const [currentPomodoroId, setCurrentPomodoroId] = useState(null);
  const [pomodoroData, setPomodoroData] = useState({
    concentracion: 25,
    descanso: 5,
    numDescansos: 4,
    objetivo: ''
  });

  useEffect(() => {
    let nuevoIntervalo;
    if (estado === 'concentracion' || estado === 'descanso') {
      nuevoIntervalo = setInterval(() => {
        setTiempoRestante((tiempoPrev) => {
          const nuevoTiempo = tiempoPrev - 1000; // Decrement by 1 second (1000ms)
          if (nuevoTiempo <= 0) {
            clearInterval(nuevoIntervalo);
            setEstado((estadoPrev) => (estadoPrev === 'concentracion' ? 'descanso' : 'concentracion'));
            return 0; // or the time for the next interval (descanso)
          }
          return nuevoTiempo;
        });
      }, 1000);
    }
    setIntervalo(nuevoIntervalo);
    return () => clearInterval(intervalo); // Clear interval on unmount or state change
  }, [estado]);

  const iniciarPomodoro = async () => {
    if (estado === 'pausado') {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No hay token de autenticación.");
          return;
        }

        const response = await fetch('http://localhost:5000/pomodoro', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(pomodoroData),
        });

        if (!response.ok) {
          const data = await response.json();
          alert(data.message || 'Error al crear la sesión de pomodoro');
          return;
        }

        const data = await response.json();
        const newPomodoroId = data._id;

        const startResponse = await fetch(`http://localhost:5000/pomodoro/${newPomodoroId}/iniciar`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!startResponse.ok) {
          const errorData = await startResponse.json();
          console.error("Error al iniciar el pomodoro:", errorData.message);
          alert("Error al iniciar el pomodoro en el servidor.");
          return;
        }

        const startData = await startResponse.json(); // Get JSON response
        setTiempoRestante(startData.tiempoRestante);  // Use server's time

        setCurrentPomodoroId(newPomodoroId);
        setEstado('concentracion');

      } catch (error) {
        console.error('Error al iniciar pomodoro:', error);
        alert('Ocurrió un error al iniciar el pomodoro.');
      }
    }
  };

  const pausarPomodoro = async () => {
    if (estado === 'concentracion' || estado === 'descanso') {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No hay token de autenticación.");
            return;
        }
        const response = await fetch(`http://localhost:5000/pomodoro/${currentPomodoroId}/pausar`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if(response.ok) {
            clearInterval(intervalo);
            setEstado('pausado');
        } else {
          const errorData = await response.json();
          console.error("Error al pausar el pomodoro:", errorData.message);
          alert("Error al pausar el pomodoro en el servidor.");
        }


      } catch (error) {
        console.error("Error al pausar el pomodoro:", error);
        alert("Error al pausar el pomodoro.");
      }
    }
  };



  const reanudarPomodoro = async () => {
    if (estado === 'pausado') {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No hay token de autenticación.");
            return;
        }

        const response = await fetch(`http://localhost:5000/pomodoro/${currentPomodoroId}/reanudar`, {
          method: 'PUT',
          headers: {
              Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Update state based on server response (if needed)
          setEstado('concentracion');  // Or set the state based on server response
        } else {
          const errorData = await response.json();
          console.error("Error al reanudar el pomodoro:", errorData.message);
          alert("Error al reanudar el pomodoro en el servidor.");

        }
      } catch (error) {
        console.error('Error al reanudar pomodoro:', error);
        alert('Ocurrió un error al reanudar el pomodoro.');

      }
    }
  };

  const cancelarPomodoro = async () => {
    try {
      if (!currentPomodoroId) {
        console.error("No se puede cancelar. No hay un Pomodoro activo.");
        alert("No se puede cancelar. Inicia un Pomodoro primero.");
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No hay token de autenticación.");
        return;
      }

      const response = await fetch(`http://localhost:5000/pomodoro/${currentPomodoroId}/cancelar`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        clearInterval(intervalo);
        setEstado('pausado'); // Or another state representing canceled
        setTiempoRestante(0);
        setCurrentPomodoroId(null);
        alert("Pomodoro cancelado.");

      } else {
        const errorData = await response.json();
        console.error("Error al cancelar el pomodoro:", errorData.message);
        alert("Error al cancelar el pomodoro en el servidor.");
      }

    } catch (error) {
      console.error('Error al cancelar el pomodoro:', error);
      alert('Error al cancelar el pomodoro.');
    }
  };


  const formatTiempo = (milisegundos) => {
    const segundosTotales = Math.round(milisegundos / 1000);
    const minutos = Math.floor(segundosTotales / 60);
    const segundosRestantes = segundosTotales % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  };


  return (
    <div>
      <h1>Pomodoro</h1>
      <div>{formatTiempo(tiempoRestante)}</div>
      <button onClick={iniciarPomodoro} disabled={estado !== 'pausado'}>Iniciar</button>
      <button onClick={pausarPomodoro} disabled={estado === 'pausado'}>Pausar</button> 
      <button onClick={reanudarPomodoro} disabled={estado !== 'pausado'}>Reanudar</button> 
      <button onClick={cancelarPomodoro} disabled={estado === 'pausado'}>Cancelar</button>

    </div>
  );
}

export default Pomodoro;
