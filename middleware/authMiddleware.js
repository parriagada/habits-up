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

module.exports = { authenticateToken };
