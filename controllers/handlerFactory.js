const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const ExpressMongoSanitize = require('express-mongo-sanitize');




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
        // console.log(req.body)
        // if (req.file){
        //     req.body.photo = req.file.filename
        //     console.log(req.body.photo)
        //     console.log(req.file.filename)   
        // } 
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
            data: {
                doc
            }
        });
    });