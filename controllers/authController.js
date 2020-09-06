const jwt = require('jsonwebtoken');
const AppError = require('./../util/appError');
const User = require('./../models/UserModel');
const validator = require('validator');

exports.authenticate = (req, res, next)=> {
    // 1. Get token from header
    const token = req.header('x-auth-token');
    // 2. Check if no token exists
    if (!token) {
        return next(new AppError('No token, authoriztion denied', 401));
    }
    // 3. Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Assign decoded.user (user object was assigned to payload) value to req.user
        req.user = decoded.user;
        next();
    } catch (error) {
        return next(new AppError('Token is not valid', 401));
    }
}

exports.login = async (req, res, next)=> {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new AppError('Wrong email or password', 400));
        }
        // Check to make sure provided password is correct
        if (!(await user.correctPassword(password, user.password))) {
            return next(new AppError('Wrong email or password!', 400));
        }
        // Generate token with JWT
        // 1. Creatt payload
        const payload = {
            user: {
                id: user.id
            }
        }
        // 2. Sign JWT
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token)=> {
            if (err) {
                return next(err, 400);
            }
            res.status(200).json({
                status: 'success',
                user, 
                token
            });
        });
    } catch (error) {
        return next(new AppError(err, 400));
    }
}

exports.restrictTo = (...roles)=> {
    return async (req, res, next)=> {
        // roles ['admin', 'user']
        // Use the user Id to retrieve user
        const userId = req.user.id;
        try {
            const currentUser = await User.findById(userId);
            if (!roles.includes(currentUser.role)) {
                return next(new AppError('You do not have permission to perform this action', 403))
            }
            next();
            
        } catch (error) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
    }
}
