const Publicacion = require('../models/publicacion.model');
const Usuario = require('../models/user.model');

// Crear una nueva publicación
const crearPublicacion = async (req, res) => {
  try {
    const { descripcion} = req.body;
    const fotoUrl = req.file.path;
    // El usuario viene del token/JWT ya autenticado
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const nuevaPublicacion = new Publicacion({
        usuarioId: usuario._id,
        usuarioNombre: usuario.nombre,
        fotoUrl, // la URL de Cloudinary
        descripcion,
        fecha: Date.now(),
    });

    await nuevaPublicacion.save();
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ mensaje: 'Error al crear publicación' });
  }
};

// Obtener todas las publicaciones (público)
const obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find().sort({ fecha: -1 });
    res.json(publicaciones);
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener publicaciones' });
  }
};

// Obtener publicaciones de un usuario específico
const obtenerPublicacionesPorUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.usuarioId;
    const publicaciones = await Publicacion.find({ usuarioId }).sort({ fecha: -1 });
    res.json(publicaciones);
  } catch (error) {
    console.error('Error al obtener publicaciones del usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener publicaciones del usuario' });
  }
};

// Dar o quitar like a una publicación
const likePublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id);
    if (!publicacion) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }
    const usuarioId = req.usuario.id;
    const index = publicacion.likes.indexOf(usuarioId);

    if (index === -1) {
      // No dio like antes: agregar
      publicacion.likes.push(usuarioId);
    } else {
      // Ya dio like: quitar
      publicacion.likes.splice(index, 1);
    }

    await publicacion.save();
    res.json({ likes: publicacion.likes.length });
  } catch (error) {
    console.error('Error al dar like:', error);
    res.status(500).json({ mensaje: 'Error al dar like a la publicación' });
  }
};

// Eliminar una publicación
const eliminarPublicacion = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id);

    if (!publicacion) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }
    // Solo el usuario dueño puede eliminar
    if (publicacion.usuarioId.toString() !== req.usuario.id) {
      return res.status(401).json({ mensaje: 'No autorizado para eliminar esta publicación' });
    }
    await publicacion.deleteOne();
    res.json({ mensaje: 'Publicación eliminada' });
  } catch (error) {
    console.error('Error al eliminar publicación:', error);
    res.status(500).json({ mensaje: 'Error al eliminar la publicación' });
  }
};

module.exports = {
  crearPublicacion,
  obtenerPublicaciones,
  obtenerPublicacionesPorUsuario,
  likePublicacion,
  eliminarPublicacion,
};
