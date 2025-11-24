const express = require('express');
const router = express.Router();
const {
  crearEvento,
  listarEventos,
  obtenerEvento,
  eliminarEvento
} = require('../controllers/historia.controller');

//Crear un nuevo evento histórico
router.post('/', crearEvento);
//Listar todos los eventos históricos
router.get('/', listarEventos);
//Obtener un evento histórico por ID
router.get('/:id', obtenerEvento);
//Eliminar un evento histórico por ID
router.delete('/:id', eliminarEvento);


module.exports = router;
