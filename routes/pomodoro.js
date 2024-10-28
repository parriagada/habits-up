const express = require('express');
const router = express.Router();
const Pomodoro = require('../models/Pomodoro'); // Ajusta la ruta si es necesario

// Obtener todos los pomodoros de un usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const pomodoros = await Pomodoro.find({ usuario: req.params.usuarioId });
    res.json(pomodoros);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un pomodoro específico por ID
router.get('/:id', getPomodoro, (req, res) => {
  res.json(res.pomodoro);
});

// Crear un nuevo pomodoro
router.post('/', async (req, res) => {
  const pomodoro = new Pomodoro({
    fecha: req.body.fecha, 
    duracion: req.body.duracion,
    usuario: req.body.usuario, // ID del usuario al que pertenece el pomodoro
    // ... otros campos del modelo Pomodoro
  });

  try {
    const nuevoPomodoro = await pomodoro.save();
    res.status(201).json(nuevoPomodoro);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un pomodoro existente (opcional, puede que no sea necesario)
router.patch('/:id', getPomodoro, async (req, res) => {
  // ... lógica para actualizar campos del pomodoro

  try {
    const pomodoroActualizado = await res.pomodoro.save();
    res.json(pomodoroActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un pomodoro
router.delete('/:id', getPomodoro, async (req, res) => {
  try {
    await res.pomodoro.remove();
    res.json({ message: 'Pomodoro eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener un pomodoro por ID
async function getPomodoro(req, res, next) {
  let pomodoro;
  try {
    pomodoro = await Pomodoro.findById(req.params.id);
    if (pomodoro == null) {
      return res.status(404).json({ message: 'Pomodoro no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.pomodoro = pomodoro;
  next();
}

module.exports = router;
