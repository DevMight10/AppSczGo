const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    contrasena: {
        type: String,
        required: true,
        minlength: 6,
    },
    intereses: {
            type: [String], // ejemplo: ['historia', 'gastronomía', 'cultura']
            default: [],
        },
    fotoPerfil: {
        type: String, // URL de la imagen
        default: '',
    }
}, {
    timestamps: true,   
});




// Middleware para encriptar la contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('contrasena')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
    next();
});

// Método para comparar contraseñas
usuarioSchema.methods.compararContrasena = async function(contraseñaIngresada) {
    return await bcrypt.compare(contraseñaIngresada, this.contrasena);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
