const User = require('../models/userModel');

exports.getAllUsers = async (req,res)=>{

    try{
        const users = await User.find();

        res.status(200).json({
            status:'success',
            results: users.length,
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


exports.createUser = async (req,res)=>{

    try{
        const users = await User.create(req.body);

        res.status(201).json({
            status:'success',
            results: users.length,
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

// exports.addExam = async (req,res)=>{

//     try{
//         const user = await User.findOne({email:'user@example.com'}, function(err,docs){
//             if (err){
//                 console.log(err);
//             }
//             else{
//                 console.log("First function call : ", docs);
//             }
//         });
//         const userId  = user._id;
//         const exams = user.exams;
//         let exam = {
//             score:20,
//             maxScore:30,
//             category: "exam",
//             branch: "dynamics"
//         }
//         exams.push(exam);
//         const updateUser = await User.findByIdAndUpdate(userId,{exams:exams}) 
//         // console.log(exams);

//         res.status(201).json({
//             status:'success',
//             results: exams,
//             // data: {
                   
//             // }
//         });
//     } catch (err){
//         res.status(404).json({
//             status: 'fail',
//             message: {}
//         });
//     }
// }
