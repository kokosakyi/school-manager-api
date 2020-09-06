const express = require('express');
const router = express.Router();

const {
    body,
    validationResult
} = require('express-validator');

const subjectController = require('./../controllers/subjectController');
const authController = require('./../controllers/authController');

const subjectValidationRules = ()=> {
    return [
        // subjectCode is required
        body('subjectCode', 'Please provide Subject Code').not().isEmpty(),
        // title is required
        body('title', 'Please provide title').not().isEmpty(),
        //classGroup is required
        body('classGroup', 'Please provide Class Group').not().isEmpty()
    ];
}

const validate = (req, res, next)=> {
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

// @route POST api/v1/subjects
// @desc Add New Subject
// @access Private
router.post('/', subjectValidationRules(), validate, authController.restrictTo('admin'), subjectController.createSubject);

// @route PATCH api/v1/subject-detail/:subjectId
// @desc Update existing Subject
// @access Private
router.put('/subject-detail/:subjectId', subjectValidationRules(), validate, authController.restrictTo('admin'), subjectController.updateSubject);

// @route GET api/v1/subjects
// @desc Get All Subjects
// @access Private
router.get('/', subjectController.getSubjects);

// @route GET api/v1/subjects/subject-detail/:subjectId
// @desc Get Subject with provided Id
// @access Private
router.get('/subject-detail/:subjectId', subjectController.getSubject);

// @route DELETE api/v1/subjects/subject-detail/:subjectId
// @desc Delete Subject with provided Id
// @access Private
router.delete('/subject-detail/:subjectId', subjectController.deleteSubject);

module.exports = router;
