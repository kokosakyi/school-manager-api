const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const authController = require('./../controllers/authController');
const classController = require('./../controllers/classController');

const classValidationRules = ()=> {
    return [
        // name is required
        body('name', 'Please provide name for class').not().isEmpty(),
        body('classGroup', 'Class must be assigned a class group').not().isEmpty()
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({
        message: err.msg
    }));
    return res.status(400).json({
        errors: extractedErrors
    });
}

// Ensure only authencated users have access to these endpoints
router.use(authController.authenticate);

// @route POST api/v1/classes
// @desc Add New Class
// @access Private
router.post('/', classValidationRules(), validate, authController.restrictTo('admin'), classController.createClass);

// @route GET api/v1/classes
// @desc Get All Classes
// @access Private
router.get('/', classController.getClasses);

// @route GET api/v1/classes/class-detail/:classId
// @desc Get Class with provided Id
// @access Private
router.get('/class-detail/:classId', classController.getClass);

module.exports = router;

