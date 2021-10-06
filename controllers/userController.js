const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const mongoose = require('mongoose');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp')

const ObjectId = mongoose.Types.ObjectId;

// const multerStorage = multer.diskStorage({
//     destination: (req,file,cb) => {
//         cb(null, 'public')
//     },
//     filename: (req, file, cb) => {
//        const ext = file.mimetype.split('/')[1];
//        cb(null, `user-${req.params.id}-${Date.now()}.${ext}`); 
//     }
// })

const multerStorage = multer.memoryStorage();

const multerFilter = (req,file,cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb (new AppError ('Not an image! Please upload only images',400),false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto = (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.params.id}-${Date.now()}.jpeg`; 

    sharp(req.file.buffer)
        .resize(250,250)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/${req.file.filename}`);

    next();    
};
// exports.getAllUsers = factory.getAll(User);
// exports.getUser = factory.getOne(User);
// exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.addUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        photo: req.body.photo,
        role: req.body.role,
        grade: req.body.grade,
        phoneNumber: req.body.phoneNumber,
        center: req.body.center,
        sessionDate: req.body.sessionDate,
        files: req.body.files
    });

    res.status(201).json({
        status: 'success'
    });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({grade:req.params.grade}).or([{ role: 'Student' }, { role: 'Moderator' }]).select('name');

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});

// exports.getUserByName = async (req, res) => {
//     try {
//         const users = await User.find({ name: req.params.name });
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 users
//             }
//         });
//     } catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }

exports.getUser = async (req, res) => {
    try {
        const id = ObjectId(req.params.id)
        const user = await User.findById(id).select('-files');
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}


exports.submitFile = async (req, res) => {
    try {
        let file = req.body
        await User.findByIdAndUpdate(req.user.id, { $push: { files: file } })

        res.status(201).json({
            status: 'success',
            results: file
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getScores = async (req, res) => {
    try {
        console.log(req.params)
        let id = ObjectId(req.params.id)
        const fileType = req.params.type;
        const files = await User.aggregate([
            {
                $match: {
                    "_id": id
                }
            }, {
                $unwind: {
                    path: "$files"
                }
            }, {
                $match: {
                    "files.type": fileType
                }
            }, {
                $group: {
                    _id: "$_id",
                    files: {
                        $push: "$files"
                    }
                }

            }
        ]);

        // let totalScore = 0;
        // let totalMaxScore = 0;

        // for (let file of files[0].files) {
        //     if (typeof (file.score) != "undefined") {
        //         totalScore += file.score
        //         totalMaxScore += file.maxScore
        //     }
        // }
        console.log(files[0].files)
        res.status(200).json({
            status: 'success',
            data: {
                files
                // files, totalScore, totalMaxScore
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.review = async (req, res) => {
    try {
        const id = req.params.id;
        const fileId = req.params.fileId;
        const file = await User.findOne(
            {
                '_id': id
            },
            {
                "files": {
                    "$elemMatch": {
                        "_id": fileId
                    }
                }
            });
        file.files[0].score = req.body.score
        file.files[0].maxScore = req.body.maxScore
        res.status(200).json({
            status: 'success',
            data: {
                file
            }
        });
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteUsers = async (req, res) => {

    try {
        await User.deleteMany({ role: 'Student' });
        res.status(204).json({
            status: 'success'
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getUserRole = async (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            role: req.user.role,
            grade: req.user.grade
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getFiles = catchAsync(async (req, res, next) => {
    const files = await User.aggregate([
        {
            $match: {
                "_id": ObjectId(req.user.id)
            }
        }, {
            $unwind: {
                path: "$files"
            }
        }, {
            $match: {
                "files.type": req.params.type,
                "files.branch": req.params.branch
            }
        }, {
            $group: {
                _id: "$_id",
                files: {
                    $push: "$files"
                }
            }

        }
    ]);
    // SEND RESPONSE
    console.log(files)
    res.status(200).json({
        status: 'success',
        data: {
            files
        }
    });
});

exports.excellentStudents = catchAsync(async (req, res, next) => {

    if(req.params.grade == "undefined" || req.params.grade == null){
        req.user.grade = "First"
    }
    else{
        req.user.grade = req.params.grade
    }
    console.log(req.user.grade)
    const files = await User.aggregate([
        { 
            $match:{
                "role":"Student",
                "grade":req.user.grade
            }
        },
        {
            $unwind: {
                path: "$files"
            }
        }, {
            $match: {
                "files.type": "exam"
            }
        }, {
            $group: {
                _id: "$_id",
                files: {
                    $push: "$files"
                }
            }
        }
    ]);
    
    let lastExams = []
    let currentExam = 0
    for (exams of files){
        let lastIndex = -1;
        for(exam of exams.files){
            if (exam.category.includes('exam'))
                {
                    lastIndex = exams.files.indexOf(exam)
                    currentExam = Math.max(parseInt(exam.category[(exam.category.indexOf('exam') + 5)]),currentExam)
                } 
        }
        if (lastIndex != -1)
        {
            lastExams.push(lastIndex)
        }
    }

    let examsScores = 0;
    let examsMaxScores = 0;
    let quizzesScores = 0;
    let quizzesMaxScores = 0;
    let totalScores = []
    let topStudents = []

    if (lastExams.length !=0 )
    {
        for (let exams = 0; exams<files.length; exams++){
            for (let cnt = 0; cnt < 12 && cnt< files[exams].files.length; cnt++){
                file = files[exams].files[lastExams[exams] - cnt]
                
                if (file.score != null && file.maxScore!=null){
                    if (file.category.includes('exam') && parseInt(file.category[5]) == currentExam )
                    {
                        examsScores+=file.score
                        examsMaxScores+=file.maxScore
                    }
                    else if (file.category.includes('quiz') && (parseInt(file.category[4]) == currentExam*2 || parseInt(file.category[4]) == currentExam*2 - 1))
                    {
                        quizzesScores+=file.score
                        quizzesMaxScores+=file.maxScore
                    }
                }
            }
            totalScores.push({
                id:files[exams]._id,
                examScores:examsScores,
                examMaxScores:examsMaxScores,
                quizzesScores:quizzesScores,
                quizzesMaxScores:quizzesMaxScores,
                total:examsScores + quizzesScores,
                maxTotal: examsMaxScores + quizzesMaxScores
            })

            examsScores = 0;
            examsMaxScores = 0;
            quizzesScores = 0;
            quizzesMaxScores = 0;
        }
        totalScores.sort(function (scores1,scores2) {
                return scores2.total - scores1.total 
            })
        
        first = await User.findOne({_id:totalScores[0].id}).select('name photo comment')
        second = await User.findOne({_id:totalScores[1].id}).select('name photo comment')
        topStudents.push(
            {
                name:first.name,
                photo:first.photo,
                comment:first.comment,
                scores:totalScores[0]
            },
            {
                name:second.name,
                photo:second.photo,
                comment:second.comment,
                scores:totalScores[1]
            }
        ) 
    }
    res.status(200).json({
            status: 'success',
            data: {
                topStudents 
            }
        });
});

exports.addComment = catchAsync (async (req,res,next) =>{

    await User.findByIdAndUpdate(req.body.id, {comment: req.body.comment})

    res.status(201).json({
        status: 'success'
    });
})
