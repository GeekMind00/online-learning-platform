const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const mongoose = require('mongoose');
const factory = require('./handlerFactory');

const ObjectId = mongoose.Types.ObjectId;

// exports.getAllUsers = factory.getAll(User);
// exports.getUser = factory.getOne(User);
// exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.addUser = catchAsync(async (req, res, next) => {
    // console.log(req.body)
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
    });

    res.status(201).json({
        status:'success'
    });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().or([{role:'Student'},{role:'Moderator'}]).select('name');

    res.status(200).json({
        status:'success',
        // results: users.length,
        data: {
            users   
        }
    });
});

exports.getUserByName = async (req,res)=>{
    try{
        const users = await User.find({name:req.params.name});
        res.status(200).json({
            status:'success',
            data: {
                users   
            }
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
exports.getUser = async (req,res)=>{
    try{ 
        const id = ObjectId(req.params.id)
        const user = await User.findById(id).select('-files');
        res.status(200).json({
            status:'success',
            data: {
               user  
            }
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}
// exports.deleteUser = async (req,res)=> {
//     try{
//         const id = req.params.id
//         await User.findByIdAndDelete(id);
//         res.status(204).json({
//             status:'success'
//         });
//     } catch (err){
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }

exports.submitFile = async (req,res)=>{
    try{
        let file = req.body
        await User.findByIdAndUpdate(req.user.id, {$push:{files:file}})

        res.status(201).json({
            status:'success',
            results: file
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getScores = async (req,res)=>{
    try{
        let id = ObjectId(req.user.id)          
        const fileType = req.params.type;
        const files = await User.aggregate([
        {
            $match:{
                "_id":id
            }
        },{
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
    
        let totalScore = 0;
        let totalMaxScore = 0;

        for (let file of files[0].files){
            if(typeof(file.score)!= "undefined")
             {totalScore +=file.score
             totalMaxScore += file.maxScore}
        }
        res.status(200).json({
            status:'success',
            data: {
               files,totalScore,totalMaxScore
            }
        });
    }
    catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.review = async (req,res)=>{
    try{
        const id = req.params.id;
        const fileId= req.params.fileId;
        const file = await User.findOne(
            {
                '_id':id
            },
            {
                "files":{
                    "$elemMatch":{
                        "_id":fileId
                    }
                }
            });
        file.files[0].score = req.body.score    
        file.files[0].maxScore = req.body.maxScore    
        res.status(200).json({
            status:'success',
            data: {
               file
            }
        });
    }
    catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteUsers = async(req,res) => {
    
    try{
        await User.deleteMany({});
        res.status(204).json({
            status:'success'
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getUserRole = async(req,res) => {
    try{
        console.log(req.user.role)
        res.status(200).json({
            status:'success',
            role:req.user.role
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }   
}