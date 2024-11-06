const mongoose = require('mongoose');

const BonsaiHabitoSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  habito: { type: mongoose.Schema.Types.ObjectId, ref: 'Habito', required: true, unique: true },
  nivelCrecimiento: { type: Number, default: 1 },
  estado: String,
  personalizaciones: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('BonsaiHabito', BonsaiHabitoSchema);
