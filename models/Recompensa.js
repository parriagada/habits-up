const mongoose = require('mongoose');

const RecompensaSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  nombre: { type: String, required: true },
  descripcion: String,
  tipo: String,
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
});

module.exports = mongoose.model('Recompensa', RecompensaSchema);