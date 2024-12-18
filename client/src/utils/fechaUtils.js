export const transformarFechas = (cumplimiento) => {
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


export const formatearDiasDeSemana = (daysArray) => {
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

export const calcularDiasCumplidos = (cumplimiento) => {
    if (!cumplimiento || cumplimiento.length === 0) {
      return 0;
    }
  
    const fechasUnicas = new Set();
  
    cumplimiento.forEach(item => {
      if (item.completado) {
        const fechaString = new Date(item.fecha).toISOString().split('T')[0];
        fechasUnicas.add(fechaString);
      }
    });
  
    return fechasUnicas.size;
  };

export const getDataTooltip = (value) => {
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