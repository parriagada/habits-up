const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Obtiene el token del header Authorization

  if (token == null) return res.sendStatus(401); // No autorizado si no hay token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Prohibido si el token es inválido
    req.user = user; // Almacena los datos del usuario en el objeto req
    next(); // Continúa con la siguiente función
  });

  
}

const esAdministrador = async (req, res, next) => {
  try {
    console.log("1. Entrando a esAdministrador");
    console.log("2. req.user:", req.user);

    if (!req.user || !req.user.id) {
      console.error("3. Error: req.user no está definido o no tiene la propiedad 'id'");
      return res.status(401).json({ message: 'Token inválido o no proporcionado.' });
    }

    const userId = req.user.id;
    console.log("4. ID del usuario a buscar:", userId);

    const usuario = await Usuario.findById(userId);
    console.log("5. Usuario encontrado:", usuario);

    if (!usuario) {
      console.error("6. Error: Usuario no encontrado en la base de datos.");
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    console.log("7. Rol del usuario:", usuario.rol);

    if (usuario.rol === 'administrador') {
      console.log("8. Usuario es administrador. Continuando...");
      next();
    } else {
      console.error("9. Error: El usuario no tiene rol de administrador.");
      res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
  } catch (error) {
    console.error("10. Error en esAdministrador:", error);
    res.status(500).json({ message: 'Error al verificar el rol de administrador' });
  }
};


module.exports = { authenticateToken, esAdministrador };
