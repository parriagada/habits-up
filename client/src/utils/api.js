const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Asegúrate de tener la URL base de tu API

export const obtenerInformacionUsuario = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token de autenticación.");
      return null; // O manejar de otra forma, como lanzar un error
    }

    const response = await fetch(`${BASE_URL}/usuarios/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data; // Devolver la información del usuario
    } else {
      const errorData = await response.json();
      console.error(
        "Error al obtener información del usuario:",
        errorData.message
      );
      return null; // O manejar de otra forma, como lanzar un error
    }
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    return null; // O manejar de otra forma, como lanzar un error
  }
};