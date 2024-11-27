const express = require('express');
const router = express.Router();
const Pomodoro = require('../models/Pomodoro');
const { authenticateToken } = require('../middleware/authMiddleware'); // Asegúrate de tener este middleware

// Obtener todos los pomodoros de un usuario
router.get('/', authenticateToken, async (req, res) => {
    try {
        const pomodoros = await Pomodoro.find({ usuario: req.user.id });
        res.json(pomodoros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo pomodoro
router.post('/', authenticateToken, async (req, res) => {
    const pomodoro = new Pomodoro({
      concentracion: req.body.concentracion,
      descanso: req.body.descanso,
      numDescansos: req.body.numDescansos,
      usuario: req.user.id, // usuario del token
      objetivo: req.body.objetivo
    });

    try {
      const nuevoPomodoro = await pomodoro.save();
      res.status(201).json(nuevoPomodoro);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id/iniciar', authenticateToken, async (req, res) => {
  try {
    const pomodoro = await Pomodoro.findOne({ _id: req.params.id, usuario: req.user.id });
    if (!pomodoro) {
      return res.status(404).json({ message: 'Pomodoro no encontrado' });
    }

    pomodoro.estado = 'concentracion';  // Set to 'concentracion' when starting
    pomodoro.inicio = Date.now(); // Set the start time.
    await pomodoro.save();
    res.json({ message: 'Pomodoro iniciado', estado: pomodoro.estado });
  } catch (error) {
    console.error('Error al iniciar pomodoro:', error);
    res.status(500).json({ message: error.message || 'Error del servidor' });
  }
});


router.put('/:id/cancelar', authenticateToken, async (req, res) => {
  try {
    const pomodoro = await Pomodoro.findOne({ _id: req.params.id, usuario: req.user.id });

    if (!pomodoro) {
      return res.status(404).json({ message: 'Pomodoro no encontrado' });
    }

    pomodoro.estado = 'finalizado'; 

    await pomodoro.save();
    res.json({ message: 'Pomodoro cancelado' });

  } catch (error) {
    console.error('Error al cancelar pomodoro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
