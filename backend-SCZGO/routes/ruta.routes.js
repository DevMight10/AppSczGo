const express = require('express');
const router = express.Router();
const proteger = require('../middleware/auth.middleware');
const {
  crearRuta,
  listarRutas,
  obtenerRuta,
  eliminarRuta,
  checkinRuta,
  completarRuta,
  eliminarTodasRutas
} = require('../controllers/ruta.controller');

// Crear (solo usuarios autenticados)
router.post('/', proteger, crearRuta);

// Listar solo las del propio usuario
router.get('/', proteger, listarRutas);

// Obtener una concreta del usuario
router.get('/:id', proteger, obtenerRuta);

// Check-in a un punto
router.post('/:id/checkin', proteger, checkinRuta);

// Marcar completada la ruta
router.post('/:id/complete', proteger, completarRuta);

// Borrar (opcional)
router.delete('/:id', proteger, eliminarRuta);

// Eliminar todas las rutas del usuario autenticado
router.delete('/', proteger, eliminarTodasRutas);

module.exports = router;
