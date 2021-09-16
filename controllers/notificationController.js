const Notification = require('../models/notificationModel');
const factory = require('./handlerFactory');



exports.getAllNotifications = factory.getAll(Notification);
exports.createNotification = factory.createOne(Notification);
exports.deleteNotification = factory.deleteOne(Notification);
