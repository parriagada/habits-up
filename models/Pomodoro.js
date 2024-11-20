const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  concentracion: { type: Number, required: true },
  descanso: { type: Number, required: true },
  numDescansos: { type: Number, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, // Referencia al usuario.
  fecha: { type: Date, default: Date.now } // Para registrar cuándo se realizó.

});

module.exports = mongoose.model('Pomodoro', pomodoroSchema);