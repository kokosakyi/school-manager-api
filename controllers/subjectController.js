const Subject = require('../models/SubjectModel');

const AppError = require('./../util/appError');

exports.createSubject = async (req, res, next)=> {
    try {
        console.log(req.body);
         const subject = await Subject.create(req.body);
         res.status(201).json({
             status: 'success',
             data: subject
         });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.updateSubject = async (req, res, next)=> {
    const subjectId = req.body.subjectId;
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(subjectId, req.body, {
            new: true,
            runValidators: true
        });
        res.status(201).json({
            status: 'success',
            data: updatedSubject
        }); 
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.getSubjects = async (req, res, next)=> {
    try {
        const subjects = await Subject.find();
        res.status(200).json({
            status: 'success',
            data: subjects
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.getSubject = async (req, res, next)=> {
    try {
        const subjectId = req.params.subjectId;
        console.log('Subject Id: ', subjectId)
        const subject = await Subject.findById(subjectId);
        res.status(200).json({
            status: 'success',
            data: subject
        }); 
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.deleteSubject = async (req, res, next) => {
    try {
        const subjectId = req.params.subjectId;
        const doc = await Subject.findByIdAndDelete(subjectId);
        if (!doc) {
            return next(new AppError('No Subject found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}