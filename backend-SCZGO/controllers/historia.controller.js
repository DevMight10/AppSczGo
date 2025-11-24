// backend/controllers/historia.controller.js

const Historia = require('../models/historia.model');

//Crear un nuevo evento histórico
const crearEvento = async (req, res) => {
  try {
    const nuevoEvento = new Historia(req.body);
    const eventoGuardado = await nuevoEvento.save();
    res.status(201).json(eventoGuardado);
  } catch (error) {
    console.error('Error al crear evento histórico:', error);
    res.status(500).json({ mensaje: 'Error al crear el evento' });
  }
};





//Listar todos los eventos históricos
const listarEventos = async (req, res) => {
  try {
    const eventos = await Historia.find().sort({ fechaEvento: 1 }); // ordenados por fecha
    res.json(eventos);
  } catch (error) {
    console.error('Error al listar eventos:', error);
    res.status(500).json({ mensaje: 'Error al listar los eventos' });
  }
};







//Obtener un evento histórico por ID
const obtenerEvento = async (req, res) => {
  try {
    const evento = await Historia.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    res.json(evento);
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({ mensaje: 'Error al obtener el evento' });
  }
};





//Eliminar un evento histórico por ID
const eliminarEvento = async (req, res) => {
  try {
    const evento = await Historia.findByIdAndDelete(req.params.id);

    if (!evento) {
      return res.status(404).json({ mensaje: 'Evento no encontrado' });
    }

    res.json({ mensaje: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el evento' });
  }
};

module.exports = {
  crearEvento,
  listarEventos,
  obtenerEvento,
  eliminarEvento,
};
