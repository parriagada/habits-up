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

      // Calcula el tiempo restante en segundos
      const tiempoRestante = pomodoro.concentracion * 60 * 1000;

      pomodoro.estado = 'concentracion';
      pomodoro.inicio = Date.now();
      pomodoro.tiempoRestante = tiempoRestante;
      await pomodoro.save();

      res.json({ message: 'Pomodoro iniciado', estado: pomodoro.estado, tiempoRestante });
  } catch (error) {
      console.error("Error al iniciar el pomodoro:", error);
      res.status(500).json({ message: 'Error al iniciar el pomodoro' });
  }
});

router.put('/:id/pausar', authenticateToken, async (req, res) => {
  try {
      const pomodoro = await Pomodoro.findOne({ _id: req.params.id, usuario: req.user.id });
      if (!pomodoro) {
          return res.status(404).json({ message: 'Pomodoro no encontrado' });
      }

      if (pomodoro.estado !== 'concentracion' && pomodoro.estado !== 'descanso') {
        return res.status(400).json({ message: 'El pomodoro no está en un estado que se pueda pausar' });
      }

      pomodoro.tiempoRestante = pomodoro.tiempoRestante - (Date.now() - pomodoro.inicio);
      pomodoro.inicio = null; 
      pomodoro.estado = 'pausado';
      await pomodoro.save();

      res.json({ message: 'Pomodoro pausado', estado: pomodoro.estado });
  } catch (error) {
      console.error("Error al pausar el pomodoro:", error);
      res.status(500).json({ message: 'Error al pausar el pomodoro' });
  }
});

router.put('/:id/reanudar', authenticateToken, async (req, res) => {
  try {
      const pomodoro = await Pomodoro.findOne({ _id: req.params.id, usuario: req.user.id });
      if (!pomodoro) {
          return res.status(404).json({ message: 'Pomodoro no encontrado' });
      }

      if (pomodoro.estado !== 'pausado') {
          return res.status(400).json({ message: 'El pomodoro no está pausado' });
      }

      pomodoro.estado = 'concentracion'; 
      pomodoro.inicio = Date.now(); 
      await pomodoro.save();

      res.json({ message: 'Pomodoro reanudado', estado: pomodoro.estado });
  } catch (error) {
      console.error("Error al reanudar el pomodoro:", error);
      res.status(500).json({ message: 'Error al reanudar el pomodoro' });
  }
});

router.put('/:id/cancelar', authenticateToken, async (req, res) => {
  try {
      const pomodoro = await Pomodoro.findOne({ _id: req.params.id, usuario: req.user.id });
      if (!pomodoro) {
          return res.status(404).json({ message: 'Pomodoro no encontrado' });
      }
      pomodoro.tiempoRestante = pomodoro.tiempoRestante - (Date.now() - pomodoro.inicio); // Calculate remaining
      pomodoro.estado = 'cancelado';
      pomodoro.fin = Date.now();
      await pomodoro.save();

      res.json({ message: 'Pomodoro cancelado', estado: pomodoro.estado });
  } catch (error) {
      console.error("Error al cancelar el pomodoro:", error);
      res.status(500).json({ message: 'Error al cancelar el pomodoro' });
  }
});

module.exports = router;