const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    subjectCode: {
        type: String,
        required: [true, 'Subject code is required'],
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Subject title is required']
    },
    classGroup: {
        type: String,
        required: [true, 'Class Group is required']
    },
    description: {
        type: String
    }
});

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;