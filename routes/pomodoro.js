const express = require('express');
const router = express.Router();
const Pomodoro = require('../models/Pomodoro');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, async (req, res) => {
    try {
        const nuevoPomodoro = new Pomodoro({
            usuario: req.user.id,
            duracionPomodoro: req.body.duracionPomodoro,
            cantidadDescansos: req.body.cantidadDescansos,
            duracionDescanso: req.body.duracionDescanso,
            objetivo: req.body.objetivo
        });
        const pomodoroGuardado = await nuevoPomodoro.save();
        res.status(201).json(pomodoroGuardado);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// In routes/pomodoros.js
router.get('/historial', authenticateToken, async (req, res) => {
    try {
      const historial = await Pomodoro.find({ usuario: req.user.id });
      res.json(historial);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const pomodoro = await Pomodoro.findById(req.params.id);

        if (!pomodoro) {
            return res.status(404).json({ message: 'Pomodoro no encontrado' });
        }

        if (pomodoro.usuario.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No tienes permiso para modificar este pomodoro' });
        }

        pomodoro.estado = req.body.estado;
        pomodoro.tiempoFin = Date.now(); // Registrar tiempo de fin
        pomodoro.tiempoTranscurrido = req.body.tiempoTranscurrido

        await pomodoro.save();
        res.json(pomodoro);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;