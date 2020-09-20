const ClassGroup = require('./../models/ClassGroupModel');

const AppError = require('./../util/appError');

exports.createClassGroups = async (req, res, next) => {
    try {
        const classGroups = req.body.classGroups;
        const classGroupObj = [];
        if (classGroups.length) {
            classGroups.map(classGroup => {
                classGroupObj.push({
                    name: classGroup
                });
            });
        }
        const savedClassGroups = await ClassGroup.insertMany(classGroupObj);
        res.status(201).json({
            status: 'success',
            data: savedClassGroups
        });
    }
    catch (error) {
        return next(new AppError(error.message, 400));
    }
}

exports.getClassGroups = async (req, res, next) => {
    try {
        const classGroups = await ClassGroup.find();
        res.status(200).json({
            status: 'success',
            data: classGroups
        });
    } catch (error) {
        return next(new AppError(err, 400));
    }
}

exports.updateClassGroups = async (req, res, next) => {
    try {
        // Get new Class Group array from req.body
        const newClassGroupArray = req.body.classGroups;
        // Get existing Class Group array from database
        const result = await ClassGroup.find();
        // Extract class group names from results
        const existingClassGroupArray = [];
        result.map(el => existingClassGroupArray.push(el.name));
        // 1) Loop through existing DB, if element is not contained in new, remove from database
        existingClassGroupArray.map(async el => {
            if (!newClassGroupArray.includes(el)) {
                await ClassGroup.findOneAndDelete({name: el});
            }
        });
        // 2) Loop through new Class Group Array, if new element is found, add to database
        newClassGroupArray.map(async el => {
            if (!existingClassGroupArray.includes(el)) {
                await ClassGroup.create({name: el});
            }
        });

        // 3) Retrieve and return current array of ClassGroup
        const data = await ClassGroup.find();
        res.status(200).json({
            status: 'success',
            data: data
        });
        
    }
    catch (error) {
        return next(new AppError(err, 400));
    }
}

exports.getClassGroup = async (req, res, next) => {
    try {
        const classGroupId = req.params.classGroupId;
        
        const classGroup = await ClassGroup.findById(classGroupId);
        res.status(200).json({
            status: 'success',
            data: classGroup
        })
    } catch (error) {
        return next(new AppError(err, 400));
    }
}

exports.getClassGroupByName = async(req, res, next) => {
    try {
        
        const classGroupName = req.params.classGroupName;

        console.log(classGroupName);
        const classGroup = await ClassGroup.find({ name: classGroupName });
        res.status(200).json({
            status: 'success',
            data: classGroup
        })
    } catch (error) {
        return next(new AppError(err, 400));
    }
}