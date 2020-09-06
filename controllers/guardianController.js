const Guardian = require('./../models/GuardianModel');
const Student = require('./../models/StudentModel');
const AppError = require('./../util/appError');
const { ObjectId } = require('mongoose').Types;
const moment = require('moment');

exports.createGuardian = async (req, res, next)=> {
    try {
        const studentId = req.body.wards[0];
        const guardian = await Guardian.create(req.body);
        //Save guardian reference in Student Model
        const updatedStudent = await Student.findByIdAndUpdate(studentId, { $push: {guardians: guardian.id}});
        res.status(201).json({
            status: 'success',
            data: guardian
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.generateGuardianNumber = async (req, res, next) => {
    try {
        const guardianRelation = req.body.relationToStudent;
        const guardians = await Guardian.find();
        const numOfGuardians = guardians.length;
        const currentYear = (moment(Date.now()).format('YY'));
        const guardianNum = pad(numOfGuardians + 1, 3);
        const guardianNumber = "G".concat(guardianRelation.substring(0, 1)).concat(currentYear).concat(guardianNum);
        res.status(200).json({
            status: 'success',
            data: guardianNumber
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.getGuardian = async (req, res, next)=> {
    try {
        const guardianId = req.params.guardianId;
        const guardian = await Guardian.findById(guardianId).populate('wards');
        res.status(200).json({
            status: 'success',
            data: guardian
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.getGuardians = async (req, res, next)=> {
    try {
        const guardians = await Guardian.find();
        res.status(200).json({
            status: 'success',
            data: guardians
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.addWard = async (req, res, next)=> {
    const { guardianNumber, relationToStudent, studentId } = req.body;
    try {
        const guardian = await Guardian.findOneAndUpdate({guardianNumber: guardianNumber}, { 
            $push: {
                wards: studentId,
                relationToStudents: {
                    studentId,
                    relation: relationToStudent
                }
            },
        });
        if (guardian === null) {
            return next(new AppError('No Guardian found!', 400));
        }

        // Next update student data with guardian info
        console.log(req.body);
        console.log(studentId);
        const student = await Student.findByIdAndUpdate(studentId, {
            $push: {
                guardians: guardian.id
            }
        });
        res.status(200).json({
            status: 'success',
            data: student
        })
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}


const pad = (n, width)=> {
    // Convert to string
    n = n + '';
    return n.length >= width ? n: new Array(width - n.length + 1).join('0') + n;
}


