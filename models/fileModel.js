const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A file must have a name'],
            trim: true,
        },
        grade: {
            type: String,
            required: [true, 'A file must belong to a grade'],
            enum: {
                values: ['First', 'Second'],
                message: 'Grade is either: first, second'
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
        category: {
            type: String,
            required: [true, 'A file must belong to a category'],
            enum: {
                values: ['videos', 'exams', 'assignments'],
                message: 'Category is either: videos, exams, or assignments'
            }
        },
        path: {
            type: String,
            trim: true,
        },
        files: [
            {
                name: {
                    type: String,
                    required: [true, 'A file must have a name'],
                    unique: true,
                    trim: true,
                },
                path: {
                    type: String,
                    trim: true,
                },
            }
        ],
    },
);


const File = mongoose.model('file', fileSchema);

module.exports = File;