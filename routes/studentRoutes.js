const express = require('express');
const router = express.Router();
const {
    body,
    validationResult
} = require('express-validator');

const studentController = require('./../controllers/studentController');
const authController = require('./../controllers/authController');

const studentValidationRules = () => {
    return [
        // firstName is required
        body('firstName', 'Please provide first name').not().isEmpty(),
        // surname is required
        body('surname', 'Please provide surname').not().isEmpty(),
        //date of birth is required
        body('dateOfBirth', 'Please select date of birth').not().isEmpty(),
        // body('dateOfBirth', 'Date of birth must be a date').isDate(),
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
        //date of birth is required
        body('admissionDate', 'Please select admission date').not().isEmpty(),
        // body('admissionDate', 'Admission date must be a date').isDate(),
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


// Ensure only authenticated users have access to these endpoints
router.use(authController.authenticate);

// @route POST api/v1/students
// @desc Register New Student
// @access Private
router.post('/', studentValidationRules(), validate, authController.restrictTo('admin'), studentController.createStudent);

// @route PATCH api/v1/students
// @desc Update existing Student
// @access Private
router.patch('/', studentValidationRules(), validate, authController.restrictTo('admin'), studentController.updateStudentInfo);

// @route GET api/v1/students
// @desc Get All Students
// @access Private
router.get('/', studentController.getStudents);

// @route DELETE api/v1/students/generateIndexNumber
// @desc Generate index number for student
// @access Private
router.get('/', studentController.deleteStudent);

// @route GET api/v1/students/student-detail/index-number/:indexNumber
// @desc Generate index number for student
// @access Private
router.get('/student-detail/index-number/:indexNumber', studentController.getStudentByIndexNumber);

// @route GET api/v1/students/student-detail/:studentId
// @desc Get Student with provided Id
// @access Private
router.get('/student-detail/:studentId', studentController.getStudent);

// @route PUT api/v1/students/student-detail/:studentId
// @desc Update Student with provided Id
// @access Private
router.put('/:studentId', authController.restrictTo('admin'), studentController.updateStudentInfo);

// @route GET api/v1/students/generateIndexNumber
// @desc Generate index number for student
// @access Private
router.get('/generateIndexNumber', studentController.generateIndexNumber);






module.exports = router;