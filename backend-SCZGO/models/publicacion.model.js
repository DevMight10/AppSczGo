// models/publicacion.model.js
const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
  usuarioNombre: {
    type: String,
    required: true,
  },
  fotoUrl: {
    type: String, // URL de Cloudinary
    required: true,
  },
  descripcion: {
    type: String,
    required: false,
    maxlength: 300,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }
  ],
  // Opcional: agrega campos según tu necesidad
  // monumento: { type: mongoose.Schema.Types.ObjectId, ref: 'Monumento' },
  // ubicacion: { type: String },
});

module.exports = mongoose.model('Publicacion', publicacionSchema);
