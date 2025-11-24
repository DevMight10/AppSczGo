const mongoose = require('mongoose');

const monumentoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del monumento es obligatorio'],
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
  },
  categoria: {
    type: String,
    enum: ['Gastronomicos',
            'Monumentos',
            'Museos',
            'Recreativos',
            'Iglesias'],
    default: 'Monumentos',
  },
  coordenadas: {
    latitud: {
      type: Number,
      required: [true, 'La latitud es obligatoria'],
    },
    longitud: {
      type: Number,
      required: [true, 'La longitud es obligatoria'],
    },
  },
  radioGeofence: {
    type: Number,
    default: 50, // 50 metros por defecto
  },
  imagenes: {
    type: [String],   // << Aquí vector de URLs
    default: [],
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Monumento', monumentoSchema);
