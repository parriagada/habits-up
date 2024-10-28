const express = require('express');
const router = express.Router();
const Habito = require('../models/Habito'); // Ajusta la ruta si es necesario

// Obtener todos los habitos
router.get('/', async (req, res) => {
  try {
    const habitos = await Habito.find().populate('usuario', 'nombre'); // Obtener nombre del usuario asociado
    res.json(habitos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un habito específico por ID
router.get('/:id', getHabito, (req, res) => {
  res.json(res.habito);
});

// Crear un nuevo habito
router.post('/', async (req, res) => {
  const habito = new Habito({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    recordatorio: {
      tipo: req.body.recordatorio.tipo,
      hora: req.body.recordatorio.hora
    },
    usuario: req.body.usuario, // ID del usuario al que pertenece el hábito
    cumplimiento: req.body.cumplimiento //  Array inicial de cumplimiento (opcional)
  });

  try {
    const nuevoHabito = await habito.save();
    res.status(201).json(nuevoHabito);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un habito existente
router.patch('/:id', getHabito, async (req, res) => {
  if (req.body.nombre != null) {
    res.habito.nombre = req.body.nombre;
  }
  if (req.body.descripcion != null) {
    res.habito.descripcion = req.body.descripcion;
  }
  if (req.body.recordatorio != null) {
    res.habito.recordatorio.tipo = req.body.recordatorio.tipo;
    res.habito.recordatorio.hora = req.body.recordatorio.hora;
  }
  // ... actualiza otros campos del modelo Habitos

  try {
    const habitoActualizado = await res.habito.save();
    res.json(habitoActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un habito
router.delete('/:id', getHabito, async (req, res) => {
  try {
    await res.habito.remove();
    res.json({ message: 'Habito eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener un habito por ID
async function getHabito(req, res, next) {
  let habito;
  try {
    habito = await Habito.findById(req.params.id).populate('usuario', 'nombre'); // Obtener nombre del usuario
    if (habito == null) {
      return res.status(404).json({ message: 'Habito no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.habito = habito;
  next();
}

module.exports = router;
