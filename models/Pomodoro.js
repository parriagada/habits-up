const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  concentracion: { type: Number, required: true },
  descanso: { type: Number, required: true },
  numDescansos: { type: Number, required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, enum: ['concentracion', 'descanso', 'pausado', 'finalizado'], default: 'pausado' },
  tiempoRestante: { type: Number, default: 0 }, // en segundos o milisegundos
  inicio: { type: Date },
  interrupciones: { type: Number, default: 0 },
  objetivo: { type: String }
});

module.exports = mongoose.model('Pomodoro', pomodoroSchema);
