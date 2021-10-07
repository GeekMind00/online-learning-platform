const File = require('../models/fileModel');
const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const notificationController = require('../controllers/notificationController');
const factory = require('./handlerFactory');
const authController = require('./../controllers/authController');


exports.getAssignments = catchAsync(async (req, res, next) => {
    const doc = await File.find({ category: 'assignments', branch: req.params.branch, grade: req.user.grade });

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        // results: doc.length,
        data: {
            doc
        }
    });
});
exports.getQuizzes = catchAsync(async (req, res, next) => {
    console.log(req.params)
    const doc = await File.find({ category: 'exams', branch: req.params.branch, grade: req.user.grade });
    console.log(req.user.grade)
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        // results: doc.length,
        data: {
            doc
        }
    });
});
exports.getVideos = catchAsync(async (req, res, next) => {
    const doc = await File.find({ category: 'videos', branch: req.params.branch, grade: req.user.grade });

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        // results: doc.length,
        data: {
            doc
        }
    });
});

exports.getAllFiles = factory.getAll(File, {});
exports.getFile = factory.getOne(File);
exports.createFile = catchAsync(async (req, res, next) => {
    const doc = await File.create(req.body);
    notificationController.createNotification(req, next);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});


exports.addFileToVideo = async (req, res) => {
    try {
        let file = req.body
        await File.findByIdAndUpdate(req.params.id, { $push: { files: file } })

        res.status(201).json({
            status: 'success',
            results: file
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.updateFile = factory.updateOne(File);
exports.deleteFile = factory.deleteOne(File);

