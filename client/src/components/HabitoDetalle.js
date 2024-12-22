import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Habitos.css";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import html2canvas from "html2canvas";
import {
  transformarFechas,
  formatearDiasDeSemana,
  calcularDiasCumplidos,
  getDataTooltip
} from "../utils/fechaUtils";

function HabitoDetalle() {
  const { habitoId } = useParams();
  const [habito, setHabito] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [añoActual, setAñoActual] = useState(new Date().getFullYear());
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const diasCumplidos = habito ? calcularDiasCumplidos(habito.cumplimiento) : 0;

  const tomarScreenshot = async () => {
    try {
      // Crear un nuevo elemento div que contenga los elementos a capturar
      const capturaDiv = document.createElement("div");
      capturaDiv.className = "captura-contenido"; // Agregar una clase para estilos personalizados
      capturaDiv.style.position = "absolute";
      capturaDiv.style.top = "-9999px";

      const elementosAClonar = document.querySelectorAll(".titulo, .imagen-habito, .nivel-habito, .total-dias-cumplidos");
            elementosAClonar.forEach(elemento => {
                capturaDiv.appendChild(elemento.cloneNode(true));
            });

      // Agregar el nuevo div al DOM
      document.body.appendChild(capturaDiv);

      // Tomar la captura de pantalla del nuevo div
      await html2canvas(capturaDiv, { backgroundColor: "white" }).then(
        (canvas) => {
          document.body.removeChild(capturaDiv); // Eliminar el div temporal
          const link = document.createElement("a");
          link.download = `${habito.nombre}-${new Date().toISOString()}.png`; // Nombre del archivo
          link.href = canvas.toDataURL("image/png"); // Convertir el canvas a una URL de datos
          link.click();
        }
      );
    } catch (error) {
      console.error("Error al tomar la captura de pantalla:", error);
      // Mostrar un mensaje de error al usuario
    }
  };
  const marcarComoCumplido = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token de autenticación.");
        return;
      }

      const response = await fetch(
        `${BASE_URL}/habitos/${habitoId}/cumplido`,
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
  const cambiarAño = (incremento) => {
    setAñoActual(añoActual + incremento);
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
          `${BASE_URL}/habitos/${habitoId}`,
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

  return (
    <div id="captura-habito" className="contenedor">
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
      <p className="total-dias-cumplidos">
        Total de días cumplidos: {diasCumplidos}
      </p>{" "}
      {/* Nuevo párrafo */}
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
      <div className="flechas-año">
        <button onClick={() => cambiarAño(-1)}>{"<"}</button>
        <span>{añoActual}</span>
        <button onClick={() => cambiarAño(1)}>{">"}</button>
      </div>
      <div className="heatmap-container">
        <CalendarHeatmap
          startDate={new Date(añoActual, 0, -1)}
          endDate={new Date(añoActual, 11, 30)}
          values={transformarFechas(habito?.cumplimiento || [])}
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
      <button
        onClick={() =>
          tomarScreenshot(
            "captura-habito",
            `${habito.nombre}-${new Date().toISOString()}.png`,
            "image/png",
            "white"
          )
        }
      >
        Descargar captura
      </button>
    </div>
  );
}

export default HabitoDetalle;
