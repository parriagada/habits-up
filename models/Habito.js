const mongoose = require('mongoose');

const habitoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true // Descripción requerida
  },
  recordatorio: {
    tipo: {
      type: String, // 'diario', 'semanal', 'mensual', etc.
      required: true // Tipo de recordatorio requerido
    },
    hora: {
      type: String, // '10:00 AM', etc.
      required: true // Hora del recordatorio requerida
    }
  },
  // ... otros campos del hábito ...
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  cumplimiento: [{
    fecha: { 
      type: Date, 
      default: Date.now 
    },
    completado: { 
      type: Boolean, 
      default: false 
    }
  }]
});

module.exports = mongoose.model('Habito', habitoSchema);
