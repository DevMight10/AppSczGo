const Usuario = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Función para generar un token JWT
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token válido por 30 días
    });
};






//Registrar un nuevo usuario
const registrarUsuario = async (req, res) => {
    const { nombre, correo, contrasena } = req.body;

  // Validar campos obligatorios
    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ mensaje: 'Por favor, completa todos los campos.' });
    }

    try {
    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ correo });
    if (usuarioExiste) {
        return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
        nombre,
        correo,
        contrasena
    });

    res.status(201).json({
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        token: generarToken(nuevoUsuario._id),
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error al registrar el usuario.' });
    }
};






//Iniciar sesión
const iniciarSesion = async (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ mensaje: 'Por favor, proporciona correo y contraseña.' });
    }

    try {
    const usuario = await Usuario.findOne({ correo });

    if (usuario && (await usuario.compararContrasena(contrasena))) {
        res.json({
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        token: generarToken(usuario._id),
        });
    } else {
        res.status(400).json({ mensaje: 'Correo o contraseña incorrectos.' });
    }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión.' });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion,
};
