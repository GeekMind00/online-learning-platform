const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const app = require("../app");



exports.getAllNotifications = factory.getAll(Notification);
exports.createNotification = catchAsync(async (req, next) => {

    const notification = await Notification.create({
        "category": req.body.category,
        "branch": req.body.branch
    });
    next();
});
exports.deleteNotification = factory.deleteOne(Notification);
