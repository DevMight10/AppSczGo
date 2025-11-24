const express = require('express');
const router = express.Router();
const { registrarUsuario, iniciarSesion } = require('../controllers/auth.controller');

// Rutas públicas
router.post('/registro', registrarUsuario);
router.post('/iniciar-sesion', iniciarSesion);

module.exports = router;
