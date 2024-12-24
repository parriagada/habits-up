// routes/foros.js
const express = require('express');
const router = express.Router();
const Foro = require('../models/Foro');
const { authenticateToken, esAdministrador } = require('../middleware/authMiddleware');

// GET /foros - Obtener todos los foros
router.get('/', async (req, res) => {
  try {
    const foros = await Foro.find().sort({ fechaCreacion: -1 });
    res.json(foros);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /foros/:id - Obtener un foro específico
router.get('/:id', async (req, res) => {
  try {
    const foro = await Foro.findById(req.params.id);
    if (foro == null) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }
    res.json(foro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /foros - Crear un nuevo foro (solo para administradores)
router.post('/', authenticateToken, esAdministrador, async (req, res) => {
  const foro = new Foro({
    titulo: req.body.titulo,
    contenido: req.body.contenido,
    autor: req.user.id, // Asignar el ID del usuario autenticado
  });

  try {
    const nuevoForo = await foro.save();
    res.status(201).json(nuevoForo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /foros/:id - Actualizar un foro (solo para administradores)
router.put('/:id', authenticateToken, esAdministrador, async (req, res) => {
  try {
    const foro = await Foro.findById(req.params.id);
    if (foro == null) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }

    // Actualizar los campos del foro
    if (req.body.titulo != null) {
      foro.titulo = req.body.titulo;
    }
    if (req.body.contenido != null) {
      foro.contenido = req.body.contenido;
    }

    const foroActualizado = await foro.save();
    res.json(foroActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /foros/:id - Eliminar un foro (solo para administradores)
router.delete('/:id', authenticateToken, esAdministrador, async (req, res) => {
  try {
    const foro = await Foro.findById(req.params.id);
    if (foro == null) {
      return res.status(404).json({ message: 'Foro no encontrado' });
    }

    await foro.deleteOne();
    res.json({ message: 'Foro eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;