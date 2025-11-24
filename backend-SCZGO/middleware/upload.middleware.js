const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sczgo_publicaciones', // nombre de la carpeta en tu Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1080, height: 1080, crop: 'limit' }], // opcional
  },
});

const upload = multer({ storage });

module.exports = upload;
