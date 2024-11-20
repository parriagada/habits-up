const express = require('express');
const router = express.Router();
const Pomodoro = require('../models/Pomodoro'); // Asegúrate de tener este modelo.
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { concentracion, descanso, numDescansos } = req.body;
    const usuario = req.user.id; // Obtener el ID del usuario del token

    const nuevoPomodoro = new Pomodoro({
      concentracion,
      descanso,
      numDescansos,
      usuario, // Guardar id del usuario.
    });

    const pomodoroGuardado = await nuevoPomodoro.save();
    res.status(201).json(pomodoroGuardado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al guardar el pomodoro.' });
  }
});


module.exports = router;
