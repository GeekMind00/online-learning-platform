const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    });

exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {
        if (req.file) req.body.photo = req.file.filename
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }

        });
    });
exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });

exports.getOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        const doc = await query;

        console.log(doc)
        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    });

exports.getAll = (Model, filter) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.find(filter);

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            // results: doc.length,
            data: {
                doc
            }
        });
    });