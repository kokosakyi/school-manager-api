const express = require('express');
const router = express.Router();
const { body, validationResult} = require('express-validator');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const userValidationRules = ()=> {
    return [
        // firstname is required
        body('firstName', 'Please provide first name').not().isEmpty(),
        //  surname is required
        body('surname', 'Please provide your surname').not().isEmpty(),
        body('email', 'Please provide valid email').isEmail(),
        body('password', 'Please provide password').not().isEmpty(),
        body('password', 'Password must be at least 8 characters in length').isLength( { min: 8})
    ]
}

const validate = (req, res, next)=> {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ message: err.msg}));
    return res.status(400).json({
        errors: extractedErrors
    });
}

// @route POST api/v1/users
// @desc Register New User
// @access Public
router.post('/', userValidationRules(), validate, userController.createUser);

// @route GET api/v1/users
// @desc Get all users
// @access Public
router.get('/', authController.authenticate, userController.getUsers);


// @route GET api/v1/users
// @desc Get User
// @access Public
router.get('/:userId', authController.authenticate, userController.getUser);

// @route PUT api/v1/users
// @desc Update User Info
// @access Public
router.put('/:userId', authController.authenticate, userController.updateUser);



module.exports = router;