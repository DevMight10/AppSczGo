const Ruta = require('../models/ruta.model');

//Crear una nueva ruta
const crearRuta = async (req, res) => {
  try {
    const body = {
      ...req.body,
      usuarioId: req.usuario.id,
      inicio: new Date(),
    };
    const nuevaRuta = new Ruta(body);
    const rutaGuardada = await nuevaRuta.save();
    res.status(201).json(rutaGuardada);
  } catch (error) {
    console.error('Error al crear ruta:', error);
    res.status(500).json({ mensaje: 'Error al crear la ruta' });
  }
};






//Listar todas las rutas
const listarRutas = async (req, res) => {
  try {
    const rutas = await Ruta.find()
      .populate('puntos.monumento') // Trae los datos del monumento
      .populate('usuarioId', 'nombre correo'); // Si quieres traer nombre y correo del usuario
    res.json(rutas);
  } catch (error) {
    console.error('Error al listar rutas:', error);
    res.status(500).json({ mensaje: 'Error al listar las rutas' });
  }
};





//Obtener una ruta por ID
const obtenerRuta = async (req, res) => {
  try {
    const ruta = await Ruta.findById(req.params.id)
      .populate('puntos.monumento')
      .populate('usuarioId', 'nombre correo');

    if (!ruta) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada' });
    }

    res.json(ruta);
  } catch (error) {
    console.error('Error al obtener ruta:', error);
    res.status(500).json({ mensaje: 'Error al obtener la ruta' });
  }
};






//Eliminar una ruta por ID
const eliminarRuta = async (req, res) => {
  try {
    const ruta = await Ruta.findByIdAndDelete(req.params.id);

    if (!ruta) {
      return res.status(404).json({ mensaje: 'Ruta no encontrada' });
    }

    res.json({ mensaje: 'Ruta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar ruta:', error);
    res.status(500).json({ mensaje: 'Error al eliminar la ruta' });
  }
};





const checkinRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const { puntoId } = req.body;
    const ruta = await Ruta.findOne({ _id: id, usuarioId: req.usuario.id });
    if (!ruta) return res.status(404).json({ mensaje: 'Ruta no encontrada' });

    ruta.checkins.push({ puntoId });
    await ruta.save();
    res.json(ruta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en check-in' });
  }
};

/**
 * Marca la ruta como completada
 */
const completarRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const ruta = await Ruta.findOne({ _id: id, usuarioId: req.usuario.id });

    if (!ruta) return res.status(404).json({ mensaje: 'Ruta no encontrada' });

    ruta.fin = new Date();
    ruta.completada = true;
    await ruta.save();
    res.json(ruta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al completar ruta' });
  }
};

const eliminarTodasRutas = async (req, res) => {
  try {
    await Ruta.deleteMany({ usuarioId: req.usuario.id });  // Elimina todas las rutas de un usuario
    res.json({ mensaje: 'Todas las rutas han sido eliminadas.' });
  } catch (error) {
    console.error('Error al eliminar todas las rutas', error);
    res.status(500).json({ mensaje: 'No se pudo eliminar todas las rutas.' });
  }
};


module.exports = {
  crearRuta,
  listarRutas,
  obtenerRuta,
  eliminarRuta,
  checkinRuta,
  completarRuta,
  eliminarTodasRutas
};

