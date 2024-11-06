const mongoose = require('mongoose');

const EncuestaSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha: { type: Date, default: Date.now },
  respuestas: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Encuesta', EncuestaSchema);