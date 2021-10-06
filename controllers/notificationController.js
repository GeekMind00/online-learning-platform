const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const app = require("../app");



exports.getAllNotifications = factory.getAll(Notification);
exports.createNotification = catchAsync(async (req, next) => {

    const notification = await Notification.create({
        "type": req.body.category,
        "branch": req.body.branch
    });
    io.emit('notification', notification);
    next();
});
exports.deleteNotification = factory.deleteOne(Notification);
