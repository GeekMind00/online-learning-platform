const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/addUser', userController.addUser);
router.post('/login', authController.login);
router.route('/logout').get( authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.post('/', userController.submitFile);


router.get('/scores/:type',userController.getScores);

router.get('/role',userController.getUserRole);

router.use(authController.restrictTo('admin'));

router
.route('/')
.delete(userController.deleteUsers);

router
.route('/:id')
.patch(userController.updateUser)
.delete(userController.deleteUser);

router.use(authController.restrictTo('admin','moderator'));

router
.route('/')
.get(userController.getAllUsers)

router.route('/info/:id').get(userController.getUser);

router.route('/:id&:fileId').patch(userController.review);

router.route('/:name').get(userController.getUserByName);

module.exports = router;
