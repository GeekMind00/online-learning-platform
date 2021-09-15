const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    
    res.status(200).json({
        status:'success',
        results: users.length,
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
        const id = req.params.id
        const user = await User.findById(id);
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

exports.deleteUser = async (req,res)=>{
    try{
        const id = req.params.id
        await User.findByIdAndDelete(id);
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

// exports.signUp = async (req,res)=>{

//     try{
//         const newUser = await User.create(req.body);
//         const token = jwt.sign({ id: newUser._id},process.env.JWT_SECRET,{
//             expiresIn: process.env.JWT_EXPIRES_IN
//         });

//         res.status(201).json({
//             status:'success',
//             // results: users.length,
//             data: {
//                 user   
//             }
//         });
//     } catch (err){
//         res.status(404).json({
//             status: 'fail',
//             message: err
//         });
//     }
// }

exports.submitFile = async (req,res)=>{
    // console.log(1);
    try{
        let file = req.body
        const id = req.params.id
        await User.findByIdAndUpdate(id, {$push:{files:file}})

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
        const id = req.params.id;
        const fileType = req.params.fileType;
        const files = await User.aggregate([{
            $unwind: {
                path: "$files"
            }
        }, {
            $match: {
                "files.fileType": fileType
            }
        }, {
            $group: {
                _id: "$_id",
                files: {
                    $push: "$files"
                }
            }
        }]);
            
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