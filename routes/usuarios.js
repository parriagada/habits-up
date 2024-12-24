const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken
const { authenticateToken, esAdministrador } = require('../middleware/authMiddleware');


// Ruta para registrar un nuevo usuario
router.post('/registrar', async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    // Verifica si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
    }

    // Hashea la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

    // Crea un nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contrasena: contrasenaHasheada,
    });

    // Guarda el usuario en la base de datos
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Busca al usuario por su correo electrónico
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Comprueba si la contraseña es correcta
    const esContraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esContraseñaValida) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Genera un token JWT
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Ajusta el tiempo de expiración según sea necesario
    });

    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// GET  Obtener información del usuario actual
router.get('/me', authenticateToken, async (req, res) => { // Usamos authenticateToken
  try {
    // authenticateToken ya ha verificado el token y ha añadido el usuario (con el ID) al objeto req (req.user)
    // Ahora buscamos al usuario por su ID, excluyendo la contraseña por seguridad
    const usuario = await Usuario.findById(req.user.id).select('-contrasena'); // Usamos req.user.id
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
