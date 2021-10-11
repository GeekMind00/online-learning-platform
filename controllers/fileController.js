const File = require('../models/fileModel');
const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const notificationController = require('../controllers/notificationController');
const factory = require('./handlerFactory');
const authController = require('./../controllers/authController');
const aws = require('aws-sdk');
const crypto = require('crypto');
const util = require("util")
const randomBytes = util.promisify(crypto.randomBytes)
const dotenv = require("dotenv");
const storage = require('./../controllers/storageFactory')
const fs = require('fs')


exports.getAssignments = catchAsync(async (req, res, next) => {
    if (req.params.grade == "First" || req.params.grade == "undefined")
        req.user.grade = "First"
    else
        req.user.grade = "Second"

    const doc = await File.find({ category: 'assignments', branch: req.params.branch, grade: req.user.grade });

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});
exports.getQuizzes = catchAsync(async (req, res, next) => {
    if (req.params.grade == "First" || req.params.grade == "undefined")
        req.user.grade = "First"
    else
        req.user.grade = "Second"

    const doc = await File.find({ category: 'exams', branch: req.params.branch, grade: req.user.grade });
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});
exports.getVideos = catchAsync(async (req, res, next) => {
    if (req.params.grade == "First" || req.params.grade == "undefined")
        req.user.grade = "First"
    else
        req.user.grade = "Second"

    const doc = await File.find({ category: 'videos', branch: req.params.branch, grade: req.user.grade });
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.getAllFiles = factory.getAll(File, {});
exports.getFile = factory.getOne(File);
exports.getVideoByName = catchAsync(async (req, res, next) => {
    const doc = await File.findOne({ name: req.params.name });
    if (!doc) {
        return next(new AppError('No document found with that name', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});
exports.createFile = async (req, res, next) => {
    await storage.uploadFile(req, next);
    fs.unlinkSync('./public/' + req.file.originalname)
    try {
        req.body.name = req.body.name.slice(0, -4)
        const doc = await File.create(req.body);
        notificationController.createNotification(req, next);
        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    }
    catch (err) {
        storage.deleteFile(req, next)
    }
};


exports.addFileToVideo = catchAsync(async (req, res, next) => {
    await storage.uploadFile(req, next);
    fs.unlinkSync('./public/' + req.file.originalname)
    let file = {
        name: req.body.name,
        path: req.body.path
    }
    await File.findByIdAndUpdate(req.params.id, { $push: { files: file } })

    res.status(201).json({
        status: 'success',
        results: file
    });
})

exports.updateFile = factory.updateOne(File);
exports.deleteFile = factory.deleteOne(File);

exports.generateUploadURL =
    catchAsync(async (req, res, next) => {
        const rawBytes = await randomBytes(16)
        const imageName = rawBytes.toString('hex')

        const params = ({
            Bucket: bucketName,
            Key: imageName,
            Expires: 60
        })

        const uploadURL = await s3.getSignedUrlPromise('putObject', params)

        res.status(200).json({
            status: 'success',
            data: {
                uploadURL
            }
        });
    });