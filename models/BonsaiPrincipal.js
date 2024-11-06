const mongoose = require('mongoose');

const BonsaiPrincipalSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
  nivelCrecimiento: { type: Number, default: 1 },
  estado: String,
  personalizaciones: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('BonsaiPrincipal', BonsaiPrincipalSchema);