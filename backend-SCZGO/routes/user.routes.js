const express = require('express');
const router = express.Router();
const {
  obtenerPerfil,
  actualizarPerfil,
  actualizarPreferencias,
  cambiarContrasena,
  eliminarCuenta,
} = require('../controllers/user.controller');

const proteger = require('../middleware/auth.middleware');

//Rutas protegidas
router.get('/perfil', proteger, obtenerPerfil);
router.put('/perfil', proteger, actualizarPerfil);
router.put('/preferencias', proteger, actualizarPreferencias);
router.put('/cambiar-contrasena', proteger, cambiarContrasena);
router.delete('/eliminar', proteger, eliminarCuenta);

module.exports = router;
