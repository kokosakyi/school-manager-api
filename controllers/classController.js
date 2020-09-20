const ClassModel = require('./../models/ClassModel');
const ClassGroup = require('./../models/ClassGroupModel');
const AppError = require('./../util/appError');

exports.createClass = async (req, res, next) => {
    try {
        const { name, classGroup, subjects} = req.body;
        const basicInfo = {
            name,
            classGroup
        }
        const classModel = await ClassModel.create(basicInfo);
        subjects.map(subject => {
            classModel.subjects.push(subject);
        });
        await classModel.save();
        res.status(201).json({
            status: 'success',
            data: classModel
        });
    }
    catch(error) {
        return next(new AppError(error.message, 400));
    }
}

exports.getClasses = async (req, res, next) => {
    try {
        const classes = await ClassModel.find().populate('classGroup');
        res.status(200).json({
            status: 'success',
            data: classes
        });
    }
    catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.getClass = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        console.log(classId);
        const classObj = await ClassModel.findById(classId).populate('classGroup').populate('subjects');
        console.log(classObj);
        res.status(200).json({
            status: 'success',
            data: classObj
        });
    }
    catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.updateClass = async (req, res, next) => {
    try {

    } catch (error) {
        return next(new AppError(error.message, 400));
    }
}

