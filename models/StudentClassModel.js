const mongoose = require('mongoose');

const studentClassSchema = new mongoose.Schema({
    
});

const StudentClass = mongoose.model('StudentClass', studentClassSchema);

module.exports = StudentClass;