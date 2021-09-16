const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/addUser', authController.addUser);
router.post('/login', authController.login);
// router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.post('/', userController.submitFile);

router.get('/:type',userController.getScores);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .delete(userController.deleteUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser);

router.route('/:id&:fileId').patch(userController.review);

router.route('/:name').get(userController.getUserByName);

module.exports = router;
