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
        const user = await User.create(req.body);

        res.status(201).json({
            status:'success',
            // results: users.length,
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

exports.submitExam = async (req,res)=>{

    try{
        let exam = req.body
        const id = req.params.id
        await User.findByIdAndUpdate(id, {$push:{exams:exam}})

        res.status(201).json({
            status:'success',
            results: exam
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: {}
        });
    }
}

exports.submitAssignment = async (req,res)=>{

    try{
        let assignment = req.body;
        const id = req.params.id
        await User.findByIdAndUpdate(id, {$push:{assignments:assignment}})

        res.status(201).json({
            status:'success',
            results: assignment
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: {}
        });
    }
}

exports.getExamsScores = async (req,res)=>{

    try{
        const id = req.params.id
        const exams = await User.findById(id,'exams');
        let totalScore = 0;
        let totalMaxScore = 0;

        for (let exam of exams.exams){
            if(typeof(exam.score)!= "undefined")
             totalScore +=exam.score
             totalMaxScore += exam.maxScore
        }
        res.status(200).json({
            status:'success',
            data: {
               exams
            }
        });
    } catch (err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.getAssignmentsScores = async (req,res)=>{

    try{
        const id = req.params.id
        const assignments = await User.findById(id,'assignments');
        let totalScore = 0;
        let totalMaxScore = 0;

        for (let assignment of assignments.assignments){
            if(typeof(assignment.score)!= "undefined")
             totalScore +=exam.score
             totalMaxScore += exam.maxScore
        }
        res.status(200).json({
            status:'success',
            data: {
               assignments
            }
        });
    } catch (err){
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