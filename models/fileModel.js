const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A file must have a name'],
            unique: true,
            trim: true,
        },
        type: {
            type: String,
            required: [true, 'A file must have a type'],
            enum: {
                values: ['video', 'file'],
                message: 'Type is either: video, file'
            }
        },
        grade: {
            type: String,
            required: [true, 'A file must belong to a grade'],
            enum: {
                values: ['first', 'second'],
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
                values: ['revision', 'model_answer', 'note', 'quiz', 'assignment'],
                message: 'Category is either: revision, model answer'
            }
        },
        path: {
            type: String,
            trim: true,
        },
    },
);


const File = mongoose.model('file', fileSchema);

module.exports = File;