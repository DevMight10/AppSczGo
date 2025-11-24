const Usuario = require('../models/user.model');
const bcrypt = require('bcryptjs');

//Obtener perfil del usuario autenticado
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-contrasena');
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error al obtener el perfil' });
  }
};






//Actualizar perfil (nombre, correo)
const actualizarPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const { nombre, correo, fotoPerfil } = req.body;

    // ✅ Validar si el nuevo correo ya existe en otro usuario
    if (correo && correo !== usuario.correo) {
      const existeCorreo = await Usuario.findOne({ correo });

      if (existeCorreo) {
        return res.status(400).json({ mensaje: 'El correo ya está registrado por otro usuario' });
      }
    }

    usuario.nombre = nombre || usuario.nombre;
    usuario.correo = correo || usuario.correo;
    usuario.fotoPerfil = fotoPerfil || usuario.fotoPerfil;

    const usuarioActualizado = await usuario.save();

    res.json({
      id: usuarioActualizado._id,
      nombre: usuarioActualizado.nombre,
      correo: usuarioActualizado.correo,
      fotoPerfil: usuarioActualizado.fotoPerfil,
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
};







//Actualizar intereses del usuario
const actualizarPreferencias = async (req, res) => {
    const usuario = await Usuario.findById(req.usuario.id);
  
    if (usuario) {
      usuario.intereses = req.body.intereses || usuario.intereses;
      await usuario.save();
  
      res.json({
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        intereses: usuario.intereses,  // <<<<< Añadimos esto
        fotoPerfil: usuario.fotoPerfil
      });
    } else {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }
  };
  






//Cambiar contraseña
const cambiarContrasena = async (req, res) => {
  const { contrasenaActual, nuevaContrasena } = req.body;

  try {
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar contraseña actual
    const esCorrecta = await usuario.compararContrasena(contrasenaActual);
    if (!esCorrecta) {
      return res.status(400).json({ mensaje: 'La contraseña actual no es correcta' });
    }

    usuario.contrasena = nuevaContrasena; // mongoose pre('save') la volverá a encriptar
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ mensaje: 'Error al cambiar la contraseña' });
  }
};







//Eliminar cuenta
const eliminarCuenta = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.usuario.id);
    res.json({ mensaje: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    res.status(500).json({ mensaje: 'Error al eliminar la cuenta' });
  }
};

module.exports = {
  obtenerPerfil,
  actualizarPerfil,
  actualizarPreferencias,
  cambiarContrasena,
  eliminarCuenta,
};
