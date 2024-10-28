const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now
  },
  duracion: {
    type: Number, // Duración en minutos
    required: true
  },
  estado: {
    type: String, // 'en progreso', 'pausado', 'finalizado'
    default: 'en progreso'
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  finalizado: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Pomodoro', pomodoroSchema);