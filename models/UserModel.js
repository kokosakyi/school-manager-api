const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Provide firstname!']
    },
    surname: {
        type: String,
        required: [true, 'Provide surname']
    },
    otherNames: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Provide email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Provide a vaild email']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Provide password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String, 
        required: [true, 'Provide password confirm'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// Hash password in 'pre-save' stage
userSchema.pre('save', async function(next) {
    // Only run this function if new user created 
    //or password was actually modified
    if (!this.isModified('password')) return next();
    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

// Set password changed at value if password modified
userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    // Set password changed at value
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// Compare saved encrypted password to user supplied password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}


const User = mongoose.model('User', userSchema);

module.exports = User;