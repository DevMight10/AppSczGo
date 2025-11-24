const express = require('express');
const router = express.Router();
const {
  crearMonumento,
  obtenerMonumento,
  listarMonumentos,
  eliminarMonumento
} = require('../controllers/monument.controller');

//Crear un nuevo monumento
router.post('/', crearMonumento);
//Listar todos los monumentos
router.get('/', listarMonumentos);
//Obtener un monumento por ID
router.get('/:id', obtenerMonumento);
//Eliminar un monumento por ID
router.delete('/:id', eliminarMonumento);


module.exports = router;
