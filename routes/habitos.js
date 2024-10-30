const express = require('express');
const router = express.Router();
const Habito = require('../models/Habito'); // Ajusta la ruta si es necesario
const { authenticateToken } = require('../middleware/authMiddleware'); // Importa el middleware de autenticación

// Obtener todos los hábitos del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  try {
    const habitos = await Habito.find({ usuario: req.user.id }); // Obtiene los hábitos del usuario autenticado
    res.json(habitos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear hábito
router.post('/', authenticateToken, async (req, res) => {
  try {
    const nuevoHabito = new Habito({
      nombre: req.body.nombre,
      usuario: req.user.id, // Asocia el hábito al usuario autenticado
      // ... otros campos del modelo Habito
    });

    const habitoGuardado = await nuevoHabito.save();
    res.status(201).json(habitoGuardado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ... otras rutas para actualizar y eliminar hábitos

module.exports = router;