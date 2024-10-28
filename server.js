const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const URI = ""

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a MongoDB (reemplaza con tu URI)
mongoose.connect(URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

app.use('/habitos', require('./routes/habitos')); 
app.use('/usuarios', require('./routes/usuarios'));
app.use('/pomodoro', require('./routes/pomodoro'));

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));