const upload = require('../middleware/upload.middleware')
const express = require('express');
const router = express.Router();
const {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacionesPorUsuario,
  likePublicacion,
  eliminarPublicacion,
} = require('../controllers/publicacion.controller');

const proteger = require('../middleware/auth.middleware'); // Autenticación por JWT

// Rutas públicas
router.get('/', obtenerPublicaciones);
router.get('/usuario/:usuarioId', obtenerPublicacionesPorUsuario);

// Rutas protegidas (requieren token)
router.post('/', proteger, upload.single('foto'), crearPublicacion);
router.put('/:id/like', proteger, likePublicacion);
router.delete('/:id', proteger, eliminarPublicacion);

module.exports = router;
