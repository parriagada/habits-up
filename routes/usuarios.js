const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario'); // Ajusta la ruta si es necesario

// Obtener todos los usuarios (puede que no sea necesario en producción)
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un usuario específico por ID
router.get('/:id', getUsuario, (req, res) => {
  res.json(res.usuario);
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  const usuario = new Usuario({
    nombre: req.body.nombre,
    email: req.body.email,
    contrasena: req.body.contrasena // Asegúrate de hashear la contraseña antes de guardarla
    // ... otros campos del modelo Usuario
  });

  try {
    const nuevoUsuario = await usuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un usuario existente
router.patch('/:id', getUsuario, async (req, res) => {
  if (req.body.nombre != null) {
    res.usuario.nombre = req.body.nombre;
  }
  if (req.body.email != null) {
    res.usuario.email = req.body.email;
  }
  // ... actualiza otros campos del modelo Usuario

  try {
    const usuarioActualizado = await res.usuario.save();
    res.json(usuarioActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un usuario
router.delete('/:id', getUsuario, async (req, res) => {
  try {
    await res.usuario.remove();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener un usuario por ID
async function getUsuario(req, res, next) {
  let usuario;
  try {
    usuario = await Usuario.findById(req.params.id);
    if (usuario == null) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.usuario = usuario;
  next();
}

module.exports = router;
