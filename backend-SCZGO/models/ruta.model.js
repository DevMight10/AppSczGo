// models/ruta.model.js
const mongoose = require('mongoose');

const rutaSchema = new mongoose.Schema({
  nombreRuta: { /* ... */ },
  puntos: [
    {
      monumento: { type: mongoose.Schema.Types.ObjectId, ref: 'Monumento', required: true },
      orden: { type: Number, required: true },
      tiempoEstimado: { type: Number, required: true },
    }
  ],
  duracionEstimada: { type: Number, required: true },
  preferencias: { type: [String], default: [] },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fechaCreacion: { type: Date, default: Date.now },

  // --- nuevos campos ---
  inicio: { type: Date },                        // cuando el usuario pulsa "Comenzar recorrido"
  fin: { type: Date },                           // cuando marca completada la ruta
  completada: { type: Boolean, default: true }, // false hasta que termine
  checkins: [                                   // cada vez que llega a un punto
    {
      puntoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Monumento' },
      llegada: { type: Date, default: Date.now },
    }
  ],
});
module.exports = mongoose.model('Ruta', rutaSchema);
