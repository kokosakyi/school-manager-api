
const User = require('./../models/UserModel');
const AppError = require('./../util/appError');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;

exports.getUsers = async (req, res, next)=> {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            data: users
        });     
    } catch (error) {
        return next(new AppError(err, 400));
    }
}

exports.getUser = async (req, res, next)=> {
    try {
        const userId = req.user.id;
        if (!ObjectId.isValid(userId)) {
            return next(new AppError('User not found!'));
        }
        const user = await User.findById(userId);
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.updateUser = async (req, res, next)=> {
    try {
        const userId = req.params.userId;
        if (!ObjectId.isValid(userId)) {
            return next(new AppError('User not found'));
        }
        const userInfo = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, userInfo, {
            new: true,
            runValidators: true
        });
        if (!updatedUser) {
            return next(new AppError('User not found'));
        }

        res.status(200).json({
            status: 'success',
            updatedUser
        });

    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.createUser = async (req, res, next)=> {
    try {
        const { password, passwordConfirm } = req.body;
        if (password !== passwordConfirm) {
            return next(new AppError('Passwords do not match', 400));
        }
        // Check to make sure user does not already exist
        const user = await User.findOne({email: req.body.email});
        if (user) {
            return next(new AppError('User already exists', 400));
        }
        const newUser = await User.create(req.body);
        // Generate token with JWT 
        // 1. Create payload
        const payload = {
            user: {
                id: newUser.id
            }
        }
        // 2. Sign JWT
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token)=> {
            if (err) {
                return next(err);
            }
            res.status(201).json({
                status: 'success',
                data: newUser,
                token
            });
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}





