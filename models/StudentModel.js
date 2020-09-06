const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    indexNumber: {
        type: Number,
        required: [true, 'Student Index Number required.'],
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'Please provide first name.']
    },
    surname: {   
        type: String,
        required: [true, 'Please provide surname.']
    },
    otherNames: {
        type: String
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Provide Date of Birth.']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        default: 'Male',
        required: [true, 'Select gender of student.']
    },
    residenceRegion: {
        type: String,
        enum: ['Ahafo', 
                'Ashanti', 
                'Bono', 
                'Bono East', 
                'Central',
                'Eastern',
                'Greater Accra',
                'North East',
                'Northern',
                'Oti',
                'Savannah',
                'Upper East',
                'Upper West',
                'Volta',
                'western',
                'Western North']
    },
    residenceDistrict: {
        type: String
    },
    residenceStreetAddress: {
        type: String
    },
    postalAddress: {
        type: String
    },
    nationalID: {
        type: String
    },
    numberOfSiblings: {
        type: Number
    },
    admissionDate: {
        type: Date
    },
    completionDate: {
        type: Date
    },
    previousSchool: {
        type: String
    },
    photo: {
        type: String
    },
    guardians: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Guardian'
        }
    ]
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;