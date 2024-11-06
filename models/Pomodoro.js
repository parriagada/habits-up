const mongoose = require('mongoose');

const PomodoroSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  fecha: { type: Date, default: Date.now },
  duracion: { type: Number, required: true },
  estado: String,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  finalizado: { type: Boolean, default: false },
});

module.exports = mongoose.model('Pomodoro', PomodoroSchema);