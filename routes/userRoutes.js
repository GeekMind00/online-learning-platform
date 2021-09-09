const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)
  .patch(userController.submitExam)
  .delete(userController.deleteUsers);

router
  .route('/exam/:id')
  .get(userController.getExamsScores)
  .patch(userController.submitExam);

router
  .route('/assignment/:id')
  .get(userController.getAssignmentsScores)
  .patch(userController.submitAssignment);      
  
router
  .route('/:name')
  .get(userController.getUserByName);


module.exports = router;