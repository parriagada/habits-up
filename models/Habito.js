const mongoose = require('mongoose');

const HabitoSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  nombre: { type: String, required: true },
  descripcion: String,
  recordatorio: mongoose.Schema.Types.Mixed, 
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  cumplimiento: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Habito', HabitoSchema);
