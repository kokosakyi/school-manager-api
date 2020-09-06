const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const loginValidationRules = ()=> {
    return [
        // email is required
        body('email', 'Please provide email').not().isEmpty(),
        // email is valid
        body('email', 'Please enter valid email').isEmail(),
        body('password', 'Please provide password').not().isEmpty()
    ]
}

const validate = (req, res, next)=> {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ message: err.msg }));
    return res.status(400).json({
        errors: extractedErrors
    });
}

// @route POST api/v1/auth
// @desc Login User
// @access Public
router.post('/', loginValidationRules(), validate, authController.login);


// @route GET api/v1/auth
// @desc Get User
// @access Public
router.get('/', authController.authenticate, userController.getUser);

module.exports = router;