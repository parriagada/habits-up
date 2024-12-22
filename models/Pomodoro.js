const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    estado: {
        type: String,
        enum: ['en curso', 'pausado', 'completado', 'cancelado'],
        default: 'en curso'
    },
    tiempoInicio: {
        type: Date,
        default: Date.now
    },
    tiempoFin: {
        type: Date,
        default: null
    },
    tiempoTranscurrido: {
        type: Number,
        default: 0
    },
    duracionPomodoro: { // Duración del pomodoro en minutos
        type: Number,
        default: 25,
        min: 1 // Valor mínimo 1 minuto
    },
    cantidadDescansos: { // Cantidad de descansos cortos
        type: Number,
        default: 3,
        min: 0
    },
    duracionDescanso: { // Duración del descanso corto en minutos
        type: Number,
        default: 5,
        min: 1
    },
    objetivo: { // Objetivo del pomodoro
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('Pomodoro', pomodoroSchema);