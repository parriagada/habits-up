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
      type: String,
      required: true
    },
    hora: {
      type: String,
      required: true
    },
    dias: {
      type: [Number],
      default: []
    },
  },
  nivelCumplimiento: {
    type: Number,
    default: 0, // Valor inicial
    min: 0,
    max: 10 
  } ,
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
