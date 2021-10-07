const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createNotification = catchAsync(async (req, next) => {

    const notification = await Notification.create({
        "category": req.body.category,
        "branch": req.body.branch
    });
    next();
});
exports.deleteNotification = factory.deleteOne(Notification);

exports.getAllNotifications = catchAsync(async (req, res, next) => {
        let notifications = await Notification.find();
        console.log(notifications)
        notifications.sort(function (notification1,notification2) {
            return notification2.createdAt - notification1.createdAt 
        })
        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            data: {
                notifications
            }
        });
    });