const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

const guardianController = require('./../controllers/guardianController');
const authController = require('./../controllers/authController');

const guardianValidationRules = () => {
    return [
        // firstName is required
        body('firstName', 'Please provide first name').not().isEmpty(),
        // surname is required
        body('surname', 'Please provide surname').not().isEmpty(),
        //date of birth is required
        body('dateOfBirth', 'Please select date of birth').not().isEmpty(),
        body('dateOfBirth', 'Date of birth must be a date').isDate(),
        // gender is required
        body('gender', 'Please select gender').not().isEmpty(),
        // Residence Region
        body('residenceRegion', 'Please select residence region').not().isEmpty(),
        // Residence District
        body('residenceDistrict', 'Please provide residence district').not().isEmpty(),
        // Residence Street
        body('residenceStreetAddress', 'Please select residence street address').not().isEmpty(),
        // Postal Address
        body('postalAddress', 'Please provide postal address').not().isEmpty(),
        // Relation to Student
        body('relationToStudent', 'Please select relationship to student').not().isEmpty(),
        //Email is required
        body('email', 'Please provide valid email').isEmail(),
    ];
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

// Ensure only authenticated users have access to these endpoints
router.use(authController.authenticate);

// @route POST api/v1/guardians
// @desc Register New Guardian
// @access Private
router.post('/', guardianValidationRules(), validate, authController.restrictTo('admin'), guardianController.createGuardian);

// @route GET api/v1/guardians
// @desc Get All Guardians
// @access Private
router.get('/', guardianController.getGuardians);

// @route GET api/v1/guardians/guardian-detail/:guardianId
// @desc Get Guardian with provided Id
// @access Private
router.get('/guardian-detail/:guardianId', guardianController.getGuardian);


// @route GET api/v1/guardians/generateIndexNumber
// @desc Generate unique number for guardian
// @access Private
router.post('/generateGuardianNumber', guardianController.generateGuardianNumber);

// @route POST api/v1/guardians/addWard
// @desc Add ward to guardian wards array
// @access Private
router.post('/addWard', guardianController.addWard);

module.exports = router;