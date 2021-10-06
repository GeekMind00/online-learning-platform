const File = require('../models/fileModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAssignments = factory.getAll(File, { type: 'file', category: 'assignment' })
exports.getQuizzes = factory.getAll(File, { type: 'file', category: 'quiz' })

exports.getAllFiles = factory.getAll(File, {});
exports.getFile = factory.getOne(File);
exports.createFile = factory.createOne(File);
exports.updateFile = factory.updateOne(File);
exports.deleteFile = factory.deleteOne(File);

