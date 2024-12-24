const jwt = require('jsonwebtoken');

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
    // Suponiendo que ya has verificado el token y tienes el usuario en req.user
    const usuario = await Usuario.findById(req.user.id);

    if (usuario && usuario.rol === 'administrador') {
      next(); // El usuario es administrador, continúa
    } else {
      res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar el rol de administrador' });
  }
};


module.exports = { authenticateToken, esAdministrador };
