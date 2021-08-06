const multer = require('multer');
const path = require('path');

module.exports = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // função de callback
            cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
        },

        // adiciona date.getTime() antes do nome da imagem
        filename: (req, file, cb) => {
            const date = new Date();
            file.key = `${date.getTime()}-${file.originalname}`;
            cb(null, file.key);
        }
    }),

    dest: path.resolve(__dirname, '..', '..', 'uploads'),
    limits: {
        fileSize: 600 * 1024,
    },

    // define extensões de arquivo aceitas
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
        ];

        if(allowedMimes.includes(file.mimetype))
          cb(null, true)
        else cb(new Error('Invalid file type'));
    }
}