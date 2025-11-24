const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Rutas base (las iremos creando después)
app.get('/', (req, res) => {
    res.send('API de GeoBicentenario funcionando');
});

// Rutas de autenticación y usuarios
app.use('/api/autenticacion', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/user.routes'));

// Rutas de monumentos
app.use('/api/monumentos', require('./routes/monument.routes'));

module.exports = app;
