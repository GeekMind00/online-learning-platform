const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A notification must have a text'],
            trim: true,
        },
    },
);


const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;