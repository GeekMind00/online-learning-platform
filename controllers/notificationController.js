const Notification = require('../models/notificationModel');
const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');



// exports.getAllNotifications = factory.getAll(Notification);
exports.createNotification = factory.createOne(Notification);
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