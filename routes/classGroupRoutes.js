const express = require('express');

const router = express.Router();

const authController = require('./../controllers/authController');
const classGroupController = require('./../controllers/classGroupController');

// Ensure only authenticated users have access to these endpoints
router.use(authController.authenticate);

// @route POST api/v1/class-groups
// @desc Add New ClassGroups
// @access Private
router.post('/', authController.restrictTo('admin'), classGroupController.createClassGroups);

// @route GET api/v1/class-groups
// @desc Get All ClassGroups
// @access Private
router.get('/', classGroupController.getClassGroups);

// @route GET api/v1/class-groups/by-name/:classGroupName
// @desc Get ClassGroup with provided Name
// @access Private
router.get('/by-name/:classGroupName', classGroupController.getClassGroupByName);

// @route GET api/v1/class-groups/:classGroupId
// @desc Get ClassGroup with provided Id
// @access Private
router.get('/:classGroupId', classGroupController.getClassGroup);




// @route POST api/v1/class-groups/update
// @desc Add New ClassGroups
// @access Private
router.post('/update', authController.restrictTo('admin'), classGroupController.updateClassGroups);

module.exports = router;
