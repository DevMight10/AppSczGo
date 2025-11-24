const jwt = require('jsonwebtoken');
const Usuario = require('../models/user.model');

const proteger = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decoded.id).select('-contrasena');
      return next(); // ¡no olvides este return!
    } catch (error) {
      console.error('Error en autenticación:', error);
      return res.status(401).json({ mensaje: 'No autorizado, token inválido' });
    }
  }

  // 🔧 Añade return aquí también
  return res.status(401).json({ mensaje: 'No autorizado, no hay token' });
};

module.exports = proteger;
