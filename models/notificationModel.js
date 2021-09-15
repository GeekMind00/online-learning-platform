const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'A notification must have a content'],
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },

    },
);


const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;