import React, { useState, useEffect } from "react";
import './Habitos.css'; // Asegúrate de que la ruta sea correcta

function Habitos() {
  const [habitos, setHabitos] = useState([]);
  const [nuevoHabito, setNuevoHabito] = useState({
    nombre: "",
    descripcion: "",
    recordatorio: {
      tipo: "",
      hora: "",
    },
  });

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
  }, []);

  const agregarHabito = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token de autenticación.");
        return;
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
    const { name, value } = e.target;
    if (name.startsWith("recordatorio.")) {
      const campoRecordatorio = name.split(".")[1];
      setNuevoHabito({
        ...nuevoHabito,
        recordatorio: {
          ...nuevoHabito.recordatorio,
          [campoRecordatorio]: value,
        },
      });
    } else {
      setNuevoHabito({
        ...nuevoHabito,
        [name]: value,
      });
    }
  };

  const handleEditarClick = (habito) => {
    setEditandoHabito(habito);
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
                    onChange={(e) =>
                      setEditandoHabito({
                        ...editandoHabito,
                        recordatorio: {
                          ...editandoHabito.recordatorio,
                          tipo: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                  </select>
                </div>
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
                <h3 className="subtitulo">{habito.nombre}</h3>
                <p>{habito.descripcion}</p>
                {habito.recordatorio && (
                  <p>
                    Recordatorio: {habito.recordatorio.tipo} a las{" "}
                    {habito.recordatorio.hora}
                  </p>
                )}
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