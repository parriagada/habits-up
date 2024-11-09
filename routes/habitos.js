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

// Obtener un hábito por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const habito = await Habito.findOne({ _id: req.params.id, usuario: req.user.id });

    if (!habito) {
      return res.status(404).json({ message: 'Hábito no encontrado' });
    }

    res.json(habito);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const nuevoHabito = new Habito({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      recordatorio: {
        tipo: req.body.recordatorio.tipo,
        hora: req.body.recordatorio.hora,
        dias: req.body.recordatorio.dias 
      },
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

// Marcar habito como cumplido
router.put('/:id/cumplido', authenticateToken, async (req, res) => {
  try {
    const habitoId = req.params.id;
    const { cumplido } = req.body; 
    const usuarioId = req.user.id; // Obtener el ID del usuario del token

    // 1. Encuentra el hábito por ID y usuario
    const habito = await Habito.findOne({ _id: habitoId, usuario: usuarioId });
    if (!habito) {
      return res.status(404).json({ message: 'Hábito no encontrado' });
    }

    // 2. Obtener la fecha del último cumplimiento
    const ultimoCumplimiento = habito.cumplimiento.reduce((ultimaFecha, cumplimientoActual) => {
      const fechaCumplimiento = new Date(cumplimientoActual.fecha);
      return cumplimientoActual.completado && fechaCumplimiento > ultimaFecha ? fechaCumplimiento : ultimaFecha;
    }, new Date(0)); 

    // 3. Calcular días de inactividad
    const hoy = new Date();
    const diffTiempo = Math.abs(hoy - ultimoCumplimiento);
    const diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));

    let nuevoNivel = habito.nivelCumplimiento;
    if (cumplido) {
      // Si se marca como cumplido, aplicar lógica de 21 días
      const diasCompletados = habito.cumplimiento.filter(c => c.completado).length;
      nuevoNivel = Math.round(((diasCompletados + 1) / 21) * 10);

      // Aplicar reducción por inactividad al nuevo nivel calculado
      if (diffDias >= 2 && nuevoNivel <= 3) {
        nuevoNivel = Math.max(0, nuevoNivel - 0.5); 
      } else if (diffDias >= 3 && nuevoNivel >= 4 && nuevoNivel <= 7) {
        nuevoNivel = Math.max(0, nuevoNivel - 1); 
      } else if (diffDias >= 4 && nuevoNivel >= 8) {
        nuevoNivel = Math.max(0, nuevoNivel - 1.5); 
      }

      // Asegurar que el nuevo nivel no supere 10
      nuevoNivel = Math.min(10, nuevoNivel);
    } else {
      // Si no se marca como cumplido, aplicar la lógica de reducción por inactividad
      if (diffDias >= 2 && nuevoNivel <= 3) {
        nuevoNivel = Math.max(0, nuevoNivel - 0.5); 
      } else if (diffDias >= 3 && nuevoNivel >= 4 && nuevoNivel <= 7) {
        nuevoNivel = Math.max(0, nuevoNivel - 1); 
      } else if (diffDias >= 4 && nuevoNivel >= 8) {
        nuevoNivel = Math.max(0, nuevoNivel - 1.5); 
      }
    }

    // 4. Actualiza el array de cumplimiento solo si no se ha cumplido hoy
    habito.cumplimiento.push({ completado: cumplido });

    // 5. Actualiza el nivel de cumplimiento en el modelo
    habito.nivelCumplimiento = nuevoNivel;

    // 6. Guarda el hábito actualizado
    await habito.save();

    res.json({ 
      nivelCumplimiento: habito.nivelCumplimiento, 
      cumplido: habito.cumplimiento[habito.cumplimiento.length - 1].completado 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el hábito' });
  }
});

module.exports = router;