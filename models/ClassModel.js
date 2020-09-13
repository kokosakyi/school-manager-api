const mongoose = require('mongoose');

const classModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide class name']
    },
    classGroup: {
        type: mongoose.Schema.ObjectId,
        ref: 'ClassGroup',
        required: [true, 'Class must be assigned a class group']
    },
    subjects: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Subject'
        }
    ]
}, 
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const ClassModel = mongoose.model('ClassModel', classModelSchema);

module.exports = ClassModel;