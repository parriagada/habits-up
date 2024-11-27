import React, { useState, useEffect } from 'react';

function Pomodoro() {
  const [tiempoRestante, setTiempoRestante] = useState(25 * 60);
  const [estado, setEstado] = useState('pausado');
  const [intervalo, setIntervalo] = useState(null);
  const [currentPomodoroId, setCurrentPomodoroId] = useState(null);
  const [pomodoroData, setPomodoroData] = useState({
    
    concentracion: 25, // Valor por defecto
    descanso: 5,      // Valor por defecto
    numDescansos: 4,   // Valor por defecto
    objetivo: ''       // Valor por defecto
  });

  useEffect(() => {
    let nuevoIntervalo;
    if (estado === 'concentracion' || estado === 'descanso') {
      nuevoIntervalo = setInterval(() => {
        setTiempoRestante((tiempoPrev) => {
          if (tiempoPrev <= 0) {
            clearInterval(nuevoIntervalo);
            setEstado((estadoPrev) => estadoPrev === 'concentracion' ? 'descanso' : 'concentracion');
            return 0;
          }
          return tiempoPrev - 1;
        });
      }, 1000);
    }
    setIntervalo(nuevoIntervalo);
    return () => clearInterval(intervalo);
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
          return; // Detener la ejecución si hay un error al guardar en la base de datos
        }
        // Si la respuesta es OK, obtener el ID del pomodoro creado y actualizar el estado local.
        
        const data = await response.json();
        setCurrentPomodoroId(data._id);  // Store _id in state

        setEstado('concentracion');

        const startResponse = await fetch(`http://localhost:5000/pomodoro/${currentPomodoroId}/iniciar`, { // Use currentPomodoroId
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
    
        if(!startResponse.ok){
            const errorData = await startResponse.json();
            console.error("Error al iniciar el pomodoro:", errorData.message);
            alert("Error al iniciar el pomodoro en el servidor.")
            return;
        }
      } catch (error) {
        console.error('Error al iniciar pomodoro:', error);
        alert('Ocurrió un error al iniciar el pomodoro.');
      }
    }
  };



  const pausarPomodoro = () => {
    clearInterval(intervalo);
    setEstado('pausado');
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
            setEstado('finalizado'); // Or another state representing canceled/failed
            setTiempoRestante(0);
            setCurrentPomodoroId(null); // Reset the ID after cancelling
            alert("Pomodoro cancelado");
            console.log("Full response:", response);
        } else {
            const errorData = await response.json();
            console.error("Error al cancelar el pomodoro:", errorData.message);
            alert("Error al cancelar el pomodoro en el servidor.");
            console.log("Full response:", response);
        }

    } catch (error) {
        console.error('Error al cancelar el pomodoro:', error);
        alert('Error al cancelar el pomodoro.');
    }
  };

  const formatTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h1>Pomodoro</h1>
      <div>{formatTiempo(tiempoRestante)}</div>
      <button onClick={iniciarPomodoro} disabled={estado !== 'pausado'}>Iniciar</button>
      <button onClick={pausarPomodoro} disabled={estado === 'pausado'}>Pausar</button>
      <button onClick={cancelarPomodoro} disabled={estado === 'pausado' || estado === 'finalizado'}>Cancelar</button> {/* Nuevo botón */}
    </div>
  );
}

export default Pomodoro;

