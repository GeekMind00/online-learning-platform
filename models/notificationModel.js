const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: [true, 'A file must have a type'],
            enum: {
                values: ['videos', 'exams', 'assignments'],
                message: 'Category is either: videos, exams, or assignments'
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
        },

    },
);


const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;