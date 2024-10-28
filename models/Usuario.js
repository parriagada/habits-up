const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,   

    unique: true
  },
  contrasena: {
    type: String,
    required:   
 true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimaConexion: {
    type: Date
  },
  puntos: {
    type: Number,
    default: 0
  },
  nivel: {
    type: Number,
    default: 1
  },
  amigos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario' 
  }]
});

module.exports = mongoose.model('Usuario', usuarioSchema);