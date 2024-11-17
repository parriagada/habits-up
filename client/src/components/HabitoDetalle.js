import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Habitos.css';


function HabitoDetalle() {
  const { habitoId } = useParams();
  const [habito, setHabito] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabitoDetalle = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No hay token de autenticación.');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/habitos/${habitoId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHabito(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al obtener los detalles del hábito');
        }
      } catch (error) {
        setError('Error al obtener los detalles del hábito: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHabitoDetalle();
  }, [habitoId]); 

  if (isLoading) {
    return <div>Cargando detalles del hábito...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatDaysOfWeek = (daysArray) => {
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    return daysArray.map(dayIndex => diasSemana[dayIndex]).join(', ');
  };

  return (
    <div className="contenedor">
      <h2 className="titulo">{habito.nombre}</h2>
      <div className="imagen-habito">
        {/* <img className="imagen-habito" src="https://preview.redd.it/2cmwtrej0hc51.png?auto=webp&s=d2fb679806db7a9e908e6f044ee3e72ee56d47a6" alt={habito.nombre} />  */}
        
        {/* <img className='bonsai-spritesheet' src={bonsaiImage} alt={habito.nombre} /> */}
        {/* <img
          className="bonsai-spritesheet"
          src={bonsaiImage}
          alt={habito.nombre}
          style={{ 
            backgroundPositionX: `-${(habito.nivelCumplimiento - 1) * 160 * 4}px` 
          }}
        />  */}

        <div className="bonsai-spritesheet" 
        style={{ 
            backgroundPositionX: `calc(${-(habito.nivelCumplimiento - 1)} * 160px * var(--pixel-size))`,
          }} alt={habito.nombre}   >

        </div>
      </div>
      <p className="nivel-habito">Nivel: {habito.nivelCumplimiento} / 10</p> 
      <p>{habito.descripcion}</p>

      {habito.recordatorio && (
        <div>
          <h3 className="subtitulo">Recordatorio</h3>
          <p>Tipo: {habito.recordatorio.tipo}</p>
          {habito.recordatorio.tipo === 'semanal' && (
            <p>Días: {formatDaysOfWeek(habito.recordatorio.dias)}</p>
          )}
          <p>Hora: {habito.recordatorio.hora}</p>
        </div>
      )}
      <button className="boton-crear">
        <a href="/habitos" style={{ textDecoration: 'none', color: 'inherit' }}>Volver a Hábitos</a>
      </button>
    </div>
  );
}

export default HabitoDetalle;
