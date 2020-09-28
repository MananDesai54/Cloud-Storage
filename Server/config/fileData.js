const multer = require('multer');

//to get uploaded file details
const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, '');
    }
})
const localUpload = multer({ storage }).single('image');

module.exports = localUpload;