const mongoose = require('mongoose');
const validator = require('validator');

const guardianSchema = new mongoose.Schema({
    guardianNumber: {
        type: String,
        required: [true]
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
            'UpperWest',
            'Volta',
            'western',
            'Western North'
        ]
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
    relationToStudents:[
        {
            studentId: {
                type: mongoose.Schema.ObjectId
            },
            relation: {
                type: String
            }
        }
    ],
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    primaryPhoneNumber: {
        type: String,
        required: [true, 'Please provide primary phone number']
    },
    secondaryPhoneNumber: {
        type: String
    },
    currentProfession: {
        type: String
    },
    wards: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Student'
        }
    ]
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Guardian = mongoose.model('Guardian', guardianSchema);

module.exports = Guardian;