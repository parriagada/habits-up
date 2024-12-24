const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const crearForo = async (titulo, contenido) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No hay token de autenticación.");
      return null;
    }

    const response = await fetch(`${BASE_URL}/foros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ titulo, contenido }),
    });

    if (response.ok) {
      const nuevoForo = await response.json();
      return nuevoForo;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message); // Lanza un error con el mensaje del servidor
    }
  } catch (error) {
    console.error("Error al crear el foro:", error);
    throw error; // Lanza el error para que sea capturado en el componente
  }
};
