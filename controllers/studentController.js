const Student = require('./../models/StudentModel');
const AppError = require('./../util/appError');

const {
    ObjectId
} = require('mongoose').Types;
const PublitioAPI = require('publitio_js_sdk').default;
const moment = require('moment');
const User = require('../models/UserModel');

exports.createStudent = async (req, res, next) => {
    try {
        let savedStudentPhoto;
        if (req.files !== null) {
            const file = req.files.studentImage.data;
            //Save the file
            const publitio = new PublitioAPI('dWg0eN2iogVSTkd0BQum', 'kHk8ib4elscQLNhG5AuNa2cxsSo4woAb');
            savedStudentPhoto = await publitio.uploadFile(file, 'file');
        }
        if (savedStudentPhoto) {
            req.body.photo = savedStudentPhoto.url_preview;
        }
        const student = await Student.create(req.body);
        res.status(201).json({
            status: 'success',
            data: student
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.updateStudentInfo = async (req, res, next) => {
    console.log(req.body);
    const studentId = req.body.studentId;
    try {
        let savedStudentPhoto;
        if (req.files !== null) {
            const file = req.files.studentImage.data;
            // Save the file
            const publitio = new PublitioAPI('dWg0eN2iogVSTkd0BQum', 'kHk8ib4elscQLNhG5AuNa2cxsSo4woAb');
            savedStudentPhoto = await publitio.uploadFile(file, 'file'); 
        } 
        if (savedStudentPhoto) {
            req.body.photo = savedStudentPhoto.url_preview;
        }
        const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, {
            new: true,
            runValidators: true
        });
        res.status(201).json({
            status: 'success',
            data: updatedStudent
        })
    }
    catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.getStudent = async (req, res, next) => {
    try {
        const studentId = req.params.studentId;
        const student = await Student.findById(studentId).populate('guardians');
        res.status(200).json({
            status: 'success',
            data: student
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.getStudents = async (req, res, next) => {
    try {
        const students = await Student.find();
        res.status(200).json({
            status: 'success',
            data: students
        })
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.deleteStudent = async (req, res, next) => {
    try {
        const studentId = req.params.userId;
        const doc = await User.findByIdAndDelete(studentId);
        if (!doc) {
            return next(new AppError('No Student found with that ID'));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.generateIndexNumber = async (req, res, next) => {
    try {
        const students = await Student.find();
        const numOfStudents = students.length;
        const currentYear = (moment(Date.now()).format('YY'));
        const nextTwoYears = (moment(Date.now()).add(2, 'year').format('YY'));
        const studentNumber = pad(numOfStudents + 1, 3);
        const indexNumber = parseInt(currentYear.concat(nextTwoYears).concat(studentNumber));
        res.status(200).json({
            status: 'success',
            data: indexNumber
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }

}

exports.getStudentByIndexNumber = async(req, res, next)=> {
    try {
        const indexNumber = req.params.indexNumber;
        const student = await Student.findOne({ indexNumber }).select('indexNumber');
        if (student === null) {
            return next(new AppError('No student with index number found', 400));
        }
        res.status(200).json({
            status: 'success',
            data: student
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}



const pad = (n, width)=> {
    // Convert to string
    n = n + '';
    return n.length >= width ? n: new Array(width - n.length + 1).join('0') + n;
}