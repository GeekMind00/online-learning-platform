const express = require('express');
const userController = require('./../controllers/userController');
const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)
  // .patch(userController.addExam);
router
  .route('/:name')
  .get(userController.getUserByName);
  module.exports = router;