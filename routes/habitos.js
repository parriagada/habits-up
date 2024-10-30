const express = require('express');
const router = express.Router();
const Habito = require('../models/Habito');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const habitos = await Habito.find({ usuario: req.user.id });
    res.json(habitos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const nuevoHabito = new Habito({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      recordatorio: req.body.recordatorio,
      usuario: req.user.id,
    });

    const habitoGuardado = await nuevoHabito.save();
    res.status(201).json(habitoGuardado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const habito = await Habito.findOne({ _id: req.params.id, usuario: req.user.id });

    if (!habito) {
      return res.status(404).json({ message: 'Hábito no encontrado' });
    }

    await Habito.deleteOne({ _id: req.params.id }); 

    res.json({ message: 'Hábito eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/editar/:id', authenticateToken, async (req, res) => { 
  try {
    const habito = await Habito.findById(req.params.id); 

    if (!habito) {
      return res.status(404).json({ message: 'Hábito no encontrado' });
    }

    if (habito.usuario.toString() !== req.user.id) { 
      return res.status(403).json({ message: 'No tienes permiso para modificar este hábito' });
    }

    habito.nombre = req.body.nombre;
    habito.descripcion = req.body.descripcion;
    habito.recordatorio = req.body.recordatorio;

    await habito.save();

    res.json(habito); 
  } catch (err) {
    console.error(err); // Registrar el error en la consola
    res.status(500).json({ message: 'Error al actualizar el hábito' }); // Enviar respuesta JSON en caso de error
  }
});

module.exports = router;