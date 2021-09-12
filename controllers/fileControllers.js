const File = require('./../models/fileModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');


exports.getAllFiles = factory.getAll(File);
exports.getFile = factory.getOne(File, { path: 'reviews' });
exports.createFile = factory.createOne(File);
exports.updateFile = factory.updateOne(File);
exports.deleteFile = factory.deleteOne(File);
