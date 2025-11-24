const app = require('./app');
const dotenv = require('dotenv');
const conectarDB = require('./config/db.config');


// Cargar variables de entorno
dotenv.config();
// Conectar base de datos antes de levantar servidor
conectarDB();

const PORT = process.env.PORT || 3000;
const localhost = process.env.localhost || 'localhost';

// Levantar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto http://${localhost}:${PORT}`);
});
