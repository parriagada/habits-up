const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('./models/Usuario');
const bcrypt = require('bcrypt');
const session = require('express-session'); // Importa express-session
const habitosRouter = require('./routes/habitos');
const pomodorosRouter = require('./routes/pomodoro');
const forosRouter = require('./routes/foros');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const URI = "mongodb+srv://parriagada:90NFvhvjlGM8q5WL@cluster0.ypkzd.mongodb.net/habits_up?retryWrites=true&w=majority&appName=Cluster0"
const secret = process.env.JWT_SECRET;

// Middleware
app.use(cors()); // Habilita CORS para permitir solicitudes de diferentes orígenes
app.use(bodyParser.json()); // Analiza el cuerpo de las solicitudes como JSON
app.use(session({ // Configura express-session para manejar sesiones de usuario
  secret: 'habitos_arriba', // Cambiar esto por una clave secreta más segura en producción
  resave: false, // No guardes la sesión si no ha sido modificada
  saveUninitialized: false // No guardes sesiones no inicializadas
}));
app.use(passport.initialize()); // Inicializa Passport.js
app.use(passport.session()); // Indica a Passport.js que use sesiones para almacenar la información del usuario

// Configuración de Passport
passport.use(
  new LocalStrategy({ usernameField: 'email' }, // Utiliza el campo 'email' para la autenticación
    async (email, contrasena, done) => { // Función de verificación de credenciales
      try {
        const usuario = await Usuario.findOne({ email }); // Busca al usuario por su correo electrónico
        if (!usuario) {
          return done(null, false, { message: 'Usuario no encontrado' }); // Usuario no encontrado
        }

        const contrasenaEsCorrecta = await bcrypt.compare(contrasena, usuario.contrasena); // Compara la contraseña proporcionada con la almacenada
        if (contrasenaEsCorrecta) {
          return done(null, usuario); // Autenticación exitosa
        } else {
          return done(null, false, { message: 'Contraseña incorrecta' }); // Contraseña incorrecta
        }
      } catch (err) {
        return done(err); // Error durante la autenticación
      }
    }
  )
);

passport.serializeUser((usuario, done) => { // Serializa al usuario (guarda el ID en la sesión)
  done(null, usuario.id);
});

passport.deserializeUser((id, done) => { // Deserializa al usuario (obtiene al usuario a partir del ID almacenado en la sesión)
  Usuario.findById(id, (err, usuario) => {
    done(err, usuario);
  });
});

// Conexión a MongoDB
mongoose.connect(URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error específico al conectar a MongoDB:', err));


// Rutas
app.use('/usuarios', require('./routes/usuarios')); // Ruta para manejar los usuarios
app.use('/pomodoros', pomodorosRouter);
app.use('/habitos', habitosRouter);
app.use('/foros', forosRouter); // Usa el router de foros

// Ruta de prueba para verificar autenticación (proteger otras rutas de manera similar)
app.get('/perfil', isAuthenticated, (req, res) => { // Solo usuarios autenticados pueden acceder a esta ruta
  res.send('¡Has accedido a tu perfil!');
});

// Middleware para verificar autenticación
function isAuthenticated(req, res, next) { // Función middleware para verificar si el usuario está autenticado
  if (req.isAuthenticated()) { // Si está autenticado, continúa con la siguiente función
    return next();
  }
  res.status(401).json({ message: 'No autorizado' }); // Si no está autenticado, envía una respuesta 401 (No autorizado)
}

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`)); // Inicia el servidor y escucha en el puerto especificado
