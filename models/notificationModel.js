const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: [true, 'A file must have a type'],
            enum: {
                values: ['video', 'exam', 'assignment'],
                message: 'Type is either: video, exam, or assignment'
            }
        },
        branch: {
            type: String,
            required: [true, 'A file must belong to a branch'],
            enum: {
                values: ['algebra', 'mechanics', 'calculus', 'geometry'],
                message: 'Branch is either: algebra, mechanics, calculus, geometry'
            }
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