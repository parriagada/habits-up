const mongoose = require('mongoose');

const habitoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  recordatorio: {
    tipo: String, //  'diario', 'semanal', 'mensual', etc.
    hora: String //  '10:00 AM', etc.
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