const Monumento = require('../models/monument.model');

//Crear un nuevo monumento
const crearMonumento = async (req, res) => {
  try {
    const nuevoMonumento = new Monumento(req.body);
    const monumentoGuardado = await nuevoMonumento.save();
    res.status(201).json(monumentoGuardado);
  } catch (error) {
    console.error('Error al crear monumento:', error);
    res.status(500).json({ mensaje: 'Error al crear el monumento' });
  }
};





//Obtener un monumento por su ID
const obtenerMonumento = async (req, res) => {
  try {
    const monumento = await Monumento.findById(req.params.id);

    if (!monumento) {
      return res.status(404).json({ mensaje: 'Monumento no encontrado' });
    }

    res.json(monumento);
  } catch (error) {
    console.error('Error al obtener monumento:', error);
    res.status(500).json({ mensaje: 'Error al obtener el monumento' });
  }
};






//Listar todos los monumentos
const listarMonumentos = async (req, res) => {
  try {
    const monumentos = await Monumento.find();
    res.json(monumentos);
  } catch (error) {
    console.error('Error al listar monumentos:', error);
    res.status(500).json({ mensaje: 'Error al listar los monumentos' });
  }
};






//(Opcional) Eliminar un monumento por ID
const eliminarMonumento = async (req, res) => {
  try {
    const monumento = await Monumento.findByIdAndDelete(req.params.id);

    if (!monumento) {
      return res.status(404).json({ mensaje: 'Monumento no encontrado' });
    }

    res.json({ mensaje: 'Monumento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar monumento:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el monumento' });
  }
};

module.exports = {
  crearMonumento,
  obtenerMonumento,
  listarMonumentos,
  eliminarMonumento,
};
