const File = require('../models/fileModel');
const factory = require('./handlerFactory');


exports.getAllFiles = factory.getAll(File);
exports.getFile = factory.getOne(File);
exports.createFile = factory.createOne(File);
exports.updateFile = factory.updateOne(File);
exports.deleteFile = factory.deleteOne(File);

