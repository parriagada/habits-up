import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Habitos.css";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";

function HabitoDetalle() {
  const { habitoId } = useParams();
  const [habito, setHabito] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const marcarComoCumplido = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token de autenticación.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/habitos/${habitoId}/cumplido`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cumplido: true }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHabito({ ...habito, ...data }); // Update the existing habit state
        // console.log(habito.cumplimiento[0]);
      } else {
        const errorData = await response.json();
        console.error(
          "Error al marcar el hábito como cumplido:",
          errorData.message
        );
        // Consider adding error handling/display to the user
      }
    } catch (error) {
      console.error("Error al marcar el hábito como cumplido:", error);
      // Consider adding error handling/display to the user
    }
  };

  const getDataTooltip = (value) => {
    // Temporary hack around null value.date issue
    if (!value || !value.date) {
      return null;
    }

    let fechaFormateada = "Sin fecha seleccionada"; // Mensaje por defecto

    if (value && value.date) {
      const fecha =
        typeof value.date === "string" ? new Date(value.date) : value.date;

      //Ajusta la fecha para que se muestre correctamente en el tooltip
      fecha.setDate(fecha.getDate() + 1);
      fechaFormateada = fecha.toLocaleDateString("es-ES");
    }
    // Configuration for react-tooltip
    return {
      "data-tooltip-id": `calendar-tooltip`,
      "data-tooltip-content": `Fecha de cumplimiento: ${fechaFormateada}`,
    };
  };

  const transformarFechas = (cumplimiento) => {
    // console.log("Datos de cumplimiento:", cumplimiento);

    const fechasTransformadas = cumplimiento
      .filter((item) => item.completado)
      .map((item) => {
        // Verifica si item.fecha ya es un objeto Date
        const fecha =
          item.fecha instanceof Date ? item.fecha : new Date(item.fecha);
        // console.log("Fecha original:", item.fecha);  // Muestra la fecha original (string)
        // console.log("Fecha como objeto Date:", fecha); // Muestra el objeto Date
        //  console.log("Fecha formateada:", fecha.toISOString().split('T')[0]); // Muestra la fecha formateada
        return {
          date: fecha.toISOString().split("T")[0],
          count: 1,
        };
      });

    //  console.log("Fechas transformadas:", fechasTransformadas);
    return fechasTransformadas;
  };

  useEffect(() => {
    const fetchHabitoDetalle = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No hay token de autenticación.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/habitos/${habitoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setHabito(data);
        } else {
          const errorData = await response.json();
          setError(
            errorData.message || "Error al obtener los detalles del hábito"
          );
        }
      } catch (error) {
        setError("Error al obtener los detalles del hábito: " + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHabitoDetalle();
  }, [habitoId, habito?.cumplimiento]);

  if (isLoading) {
    return <div>Cargando detalles del hábito...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatearDiasDeSemana = (daysArray) => {
    const diasSemana = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];
    return daysArray.map((dayIndex) => diasSemana[dayIndex]).join(", ");
  };

  return (
    <div className="contenedor">
      <h2 className="titulo">{habito.nombre}</h2>
      <div className="imagen-habito">
        <div
          className="bonsai-spritesheet"
          style={{
            backgroundPositionX: `calc(${-habito.nivelCumplimiento} * 160px * var(--pixel-size))`,
          }}
          alt={habito.nombre}
        ></div>
      </div>

      <p className="nivel-habito">Nivel: {habito.nivelCumplimiento} / 10</p>
      <p>{habito.descripcion}</p>

      {habito.recordatorio && (
        <div>
          <h3 className="subtitulo">Recordatorio</h3>
          <p>Tipo: {habito.recordatorio.tipo}</p>
          {habito.recordatorio.tipo === "semanal" && (
            <p>Días: {formatearDiasDeSemana(habito.recordatorio.dias)}</p>
          )}
          <p>Hora: {habito.recordatorio.hora}</p>
        </div>
      )}

      <h3>Historial de Cumplimiento</h3>
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={new Date("2024-01-01")}
          endDate={new Date("2024-12-31")}
          values={transformarFechas(habito.cumplimiento)}
          classForValue={(value) => {
            return value ? "color-filled" : "color-empty";
          }}
          showWeekdayLabels={true}
          weekdayLabels={["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]}
          monthLabels={[
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic",
          ]}
          tooltipDataAttrs={getDataTooltip}
        />
        <Tooltip anchorSelect=".color-filled, .color-empty" place="top">
          {/* mostrar fecha que se selecciona*/}
        </Tooltip>
      </div>

      <button className="boton-crear">
        <a href="/habitos" style={{ textDecoration: "none", color: "inherit" }}>
          Volver a Hábitos
        </a>
      </button>
      <button onClick={() => marcarComoCumplido(habito._id)}>Cumplido</button>
    </div>
  );
}

export default HabitoDetalle;
