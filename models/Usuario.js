const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true   
 },
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now },
  ultimaConexion: { type: Date, default: Date.now },
  puntos: { type: Number, default: 0 },
  nivel: { type: Number, default: 1 },
  amigos: [String], 
  rol: { type: String, default: 'usuario' }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);