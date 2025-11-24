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

// Rutas turísticas
app.use('/api/rutas', require('./routes/ruta.routes'));

// Rutas de SCZ Share (red social)
app.use('/api/publicaciones', require('./routes/publicacion.routes'));
app.use('/api/historias', require('./routes/historia.routes'));

module.exports = app;
