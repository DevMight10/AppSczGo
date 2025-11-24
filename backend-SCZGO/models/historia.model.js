const mongoose = require('mongoose');

const historiaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título del evento es obligatorio'],
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción del evento es obligatoria'],
  },
  fechaEvento: {
    type: Date,
    //required: [true, 'La fecha del evento es obligatoria'],
    default: [],
  },
  imagenes: {
    type: [String],  // Array de URLs de imágenes
    default: [],
  },
  multimedia: {
    type: [String], // Videos, audios, PDFs si quieres
    default: [],
  },
  categoria: {
    type: String,
    enum: ['histórico', 'cultural'],
    default: 'histórico',
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Historia', historiaSchema);
