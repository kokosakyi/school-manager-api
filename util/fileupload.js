const multer = require('multer');

const fileUpload = multer({
    destination: (req, file, cb) => { console.log(file); console.log('it is well')}
});

module.exports = fileUpload;