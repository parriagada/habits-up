import React, { useState, useEffect } from "react";
import './Habitos.css';
import { Link } from 'react-router-dom';

function Habitos() {
  const [habitos, setHabitos] = useState([]);
  const [nuevoHabito, setNuevoHabito] = useState({
    nombre: "",
    descripcion: "",
    recordatorio: {
      tipo: "",
      hora: "",
      dias: [],
    },
  });

  const [mostrarPopupNotificaciones, setMostrarPopupNotificaciones] = useState(false);

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const [editandoHabito, setEditandoHabito] = useState(null);

  useEffect(() => {
    const obtenerHabitos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No hay token de autenticación.");
          return;
        }

        const response = await fetch("http://localhost:5000/habitos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHabitos(data);
        } else {
          const errorData = await response.json();
          console.error("Error al obtener hábitos:", errorData.message);
        }
      } catch (error) {
        console.error("Error al obtener hábitos:", error);
      }
    };

    obtenerHabitos();

    const verificarPermisosNotificaciones = async () => {
      if (!("Notification" in window)) {
        // El navegador no soporta notificaciones
        return;
      }

      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") {
        setMostrarPopupNotificaciones(true);
      }
    };

    verificarPermisosNotificaciones();
  }, []);

  const solicitarPermisoNotificaciones = async () => {
    const permiso = await Notification.requestPermission();
    if (permiso === "granted") {
      setMostrarPopupNotificaciones(false);
    }
    //Si el usuario deniega el permiso se mantiene el popup
  };

  const agregarHabito = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token de autenticación.");
        return;
      }
      if(Notification.permission !== "granted"){
        alert("Recuerda activar las notificaciones para recibir recordatorios.")
      }

      const response = await fetch("http://localhost:5000/habitos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nuevoHabito.nombre,
          descripcion: nuevoHabito.descripcion,
          recordatorio: {
            tipo: nuevoHabito.recordatorio.tipo,
            hora: nuevoHabito.recordatorio.hora,
            dias: nuevoHabito.recordatorio.dias,
          },
        }),
      });

      if (response.ok) {
        const nuevoHabitoCreado = await response.json();
        setHabitos([...habitos, nuevoHabitoCreado]);
        setNuevoHabito({
          nombre: "",
          descripcion: "",
          recordatorio: {
            tipo: "",
            hora: "",
            dias: [],
          },
        });
      } else {
        const data = await response.json();
        alert(data.message || "Error al agregar el hábito");
      }
    } catch (error) {
      console.error("Error al agregar el hábito:", error);
      alert("Ocurrió un error al agregar el hábito.");
    }
  };

  const eliminarHabito = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token de autenticación.");
        return;
      }

      const response = await fetch(`http://localhost:5000/habitos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setHabitos(habitos.filter((habito) => habito._id !== id));
      } else {
        const errorData = await response.json();
        console.error("Error al eliminar el hábito:", errorData.message);
      }
    } catch (error) {
      console.error("Error al eliminar el hábito:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name.startsWith("recordatorio.")) {
      const campoRecordatorio = name.split(".")[1];
  
      if (name === "recordatorio.dias" && type === "checkbox") {
        const diaSeleccionado = parseInt(value, 10);
        setNuevoHabito((prevHabito) => ({
          ...prevHabito,
          recordatorio: {
            ...prevHabito.recordatorio,
            dias: checked
              ? [...prevHabito.recordatorio.dias, diaSeleccionado] // Agregar al array
              : prevHabito.recordatorio.dias.filter((d) => d !== diaSeleccionado), // Eliminar del array
          },
      }));
      } else {
        // Manejo normal para tipo y hora
        setNuevoHabito((prevHabito) => ({
          ...prevHabito,
          recordatorio: {
            ...prevHabito.recordatorio,
            [campoRecordatorio]: value,
          },
        }));
      }
    } else {
      // Manejo de otros campos (nombre, descripción)
      setNuevoHabito((prevHabito) => ({
        ...prevHabito,
        [name]: value,
      }));
    }
  };

  const handleEditarClick = (habito) => {
    // Al hacer clic en editar, si el tipo es diario, limpia los días
    if (habito.recordatorio.tipo === 'diario') {
      habito.recordatorio.dias = [];
    }
    setEditandoHabito(habito);
  };

  const marcarComoCumplido = async (habitoId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token de autenticación.");
        return;
      }

      const response = await fetch(`http://localhost:5000/habitos/${habitoId}/cumplido`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' // Asegúrate de enviar JSON
        },
        body: JSON.stringify({ cumplido: true }) // Envía el estado "cumplido"
      });
  
      if (response.ok) {
        const data = await response.json(); // Obtén la respuesta del servidor
  
        // Actualiza el estado en la interfaz de usuario
        setHabitos(habitos.map(habito => 
          habito._id === habitoId ? { ...habito, ...data } : habito 
        ));
      } else {
        const errorData = await response.json();
        console.error("Error al marcar el hábito como cumplido:", errorData.message);
      }
    } catch (error) {
      console.error("Error al marcar el hábito como cumplido:", error);
    }
  };

  const guardarCambiosHabito = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token de autenticación.");
        return;
      }
  
      console.log(`URL: http://localhost:5000/habitos/editar/${id}`); // Verificar la URL
      console.log('Cuerpo:', JSON.stringify(editandoHabito)); // Verificar el cuerpo de la solicitud
  
      const response = await fetch(`http://localhost:5000/habitos/editar/${id}`, { // Asegurarse de que la URL es correcta
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Encabezado Content-Type
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editandoHabito),
      });
  
      console.log(response); // Imprimir la respuesta completa
  
      if (response.ok) {
        // ... código para actualizar la lista de hábitos ...
        setHabitos(habitos.map(h => (h._id === id ? editandoHabito : h)));
        // Salir del modo de edición
        setEditandoHabito(null);  
      } else {
        try {
          const data = await response.json();
          alert(data.message || "Error al actualizar el hábito");
        } catch (error) {
          console.error("Error al analizar la respuesta:", error);
          alert("Error al actualizar el hábito. La respuesta del servidor no es válida.");
        }
      }
    } catch (error) {
      console.error("Error al actualizar el hábito:", error);
      alert("Ocurrió un error al actualizar el hábito.");
    }
  };

  return (
    <div className="contenedor">
      {mostrarPopupNotificaciones && (
        <div className="popup-notificaciones">
          <div className="popup-contenido">
            <h3>¿Quieres recibir recordatorios de tus hábitos?</h3>
            <p>Activa las notificaciones para no olvidar tus tareas.</p>
            <button onClick={solicitarPermisoNotificaciones}>Activar Notificaciones</button>
            <button onClick={() => setMostrarPopupNotificaciones(false)}>Cancelar</button>
          </div>
        </div>
      )}
      <h2 className="titulo">Mis Hábitos</h2>
      <ul>
        {habitos.map((habito) => (
          <li key={habito._id}>
            {editandoHabito && editandoHabito._id === habito._id ? (
              <div>
                <input
                  type="text"
                  name="nombre"
                  value={editandoHabito.nombre}
                  onChange={(e) =>
                    setEditandoHabito({
                      ...editandoHabito,
                      nombre: e.target.value,
                    })
                  }
                />
                <textarea
                  name="descripcion"
                  value={editandoHabito.descripcion}
                  onChange={(e) =>
                    setEditandoHabito({
                      ...editandoHabito,
                      descripcion: e.target.value,
                    })
                  }
                />
                <div>
                  <label htmlFor="tipoRecordatorio">
                    Tipo de recordatorio:
                  </label>
                  <select
                    id="tipoRecordatorio"
                    name="recordatorio.tipo"
                    value={editandoHabito.recordatorio.tipo}
                    onChange={(e) => {
                      const nuevoTipo = e.target.value;
                      setEditandoHabito((prevHabito) => ({
                        ...prevHabito,
                        recordatorio: {
                          ...prevHabito.recordatorio,
                          tipo: nuevoTipo,
                          // Limpiar días si se cambia a diario
                          dias: nuevoTipo === 'diario' ? [] : prevHabito.recordatorio.dias,
                        },
                      }));
                    }}
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                  </select>
                </div>
                {editandoHabito.recordatorio.tipo === "semanal" && (
                  <div>
                    <label htmlFor="diasRecordatorio">Días de la semana:</label>
                    <div id="diasRecordatorio">
                      {diasSemana.map((dia, index) => (
                        <label key={index}>
                          <input
                            type="checkbox"
                            name="recordatorio.dias"
                            value={index}
                            checked={editandoHabito.recordatorio.dias.includes(index)}
                            onChange={(e) => {
                              const diaSeleccionado = parseInt(e.target.value, 10);
                              setEditandoHabito((prevHabito) => ({
                                ...prevHabito,
                                recordatorio: {
                                  ...prevHabito.recordatorio,
                                  dias: e.target.checked
                                    ? [...prevHabito.recordatorio.dias, diaSeleccionado]
                                    : prevHabito.recordatorio.dias.filter((d) => d !== diaSeleccionado),
                                },
                              }));
                            }}
                          />
                          {dia}
                        </label>
                      ))}
                    </div>
                  </div>
                )}            
                <input
                  type="time"
                  name="recordatorio.hora"
                  value={editandoHabito.recordatorio.hora}
                  onChange={(e) =>
                    setEditandoHabito({
                      ...editandoHabito,
                      recordatorio: {
                        ...editandoHabito.recordatorio,
                        hora: e.target.value,
                      },
                    })
                  }
                />
                <button onClick={() => guardarCambiosHabito(habito._id)}>
                  Guardar Cambios
                </button>
                <button onClick={() => setEditandoHabito(null)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div>
                <h3 className="subtitulo" ><Link to={`/habitos/${habito._id}`}>{habito.nombre}</Link></h3>
                <p>{habito.descripcion}</p>
                <p>Nivel de cumplimiento: {habito.nivelCumplimiento} / 10</p>
                {!editandoHabito && (
                  <div>
                    {habito.recordatorio && (
                        <p>
                        Recordatorio:{" "}
                        {habito.recordatorio.tipo === "semanal" &&
                          // Ordena los días antes de mostrarlos
                          habito.recordatorio.dias
                            .sort((a, b) => a - b) // Ordena numéricamente
                            .map((diaNumero) => diasSemana[diaNumero]) // Mapea al nombre del día
                            .join(", ")
                        }{" "}
                        a las {habito.recordatorio.hora}
                      </p>
                    )}
                  </div>
                )}

                {/* Botón para marcar como cumplido */}
                <button onClick={() => marcarComoCumplido(habito._id)}>
                  Cumplido
                </button>
                {/* Botones para editar y eliminar */}
                <button onClick={() => handleEditarClick(habito)}>
                  Editar
                </button>
                <button onClick={() => eliminarHabito(habito._id)}>
                  Eliminar
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div>
        <h3 className="subtitulo">Nuevo Hábito</h3>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del hábito"
          value={nuevoHabito.nombre}
          onChange={handleChange}
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={nuevoHabito.descripcion}
          onChange={handleChange}
        />
        <div>
          <label htmlFor="tipoRecordatorio">Tipo de recordatorio:</label>
          <select
            id="tipoRecordatorio"
            name="recordatorio.tipo"
            value={nuevoHabito.recordatorio.tipo}
            onChange={handleChange}
          >
            <option value="">Selecciona un tipo</option>
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
          </select>
        </div>
        {/* Mostrar selección de días solo si el tipo es semanal */}
        {nuevoHabito.recordatorio.tipo === "semanal" && (
          <div>
            <label htmlFor="diasRecordatorio">Días de la semana:</label>
            <div id="diasRecordatorio">
              <input type="checkbox" name="recordatorio.dias" value="0" onChange={handleChange} /> Lunes
              <input type="checkbox" name="recordatorio.dias" value="1" onChange={handleChange} /> Martes
              <input type="checkbox" name="recordatorio.dias" value="2" onChange={handleChange} /> Miercoles
              <input type="checkbox" name="recordatorio.dias" value="3" onChange={handleChange} /> Jueves
              <input type="checkbox" name="recordatorio.dias" value="4" onChange={handleChange} /> Viernes
              <input type="checkbox" name="recordatorio.dias" value="5" onChange={handleChange} /> Sábado
              <input type="checkbox" name="recordatorio.dias" value="6" onChange={handleChange} /> Domingo
            </div>
          </div>
        )}

        <input
          type="time"
          name="recordatorio.hora"
          value={nuevoHabito.recordatorio.hora}
          onChange={handleChange}
        />
        <button className="boton-crear" onClick={agregarHabito}>
          Agregar
        </button>
      </div>
  </div>
  )
}

export default Habitos;