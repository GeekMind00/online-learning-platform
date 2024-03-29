const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.get('/:branch&:type', userController.getFiles);

router.patch('/updateMyPassword', authController.updatePassword);

router.post('/',userController.uploadUserPhoto, userController.submitFile);

router.get('/scores/:id&:type', userController.getScores);

router.get('/excellentStudents/:grade', userController.excellentStudents)

router.get('/role', userController.getUserRole);

router.route('/info/:id').get(userController.getUser);

router.use(authController.restrictTo('Admin'));

router.patch('/comment', userController.addComment)

router.post('/addUser',userController.uploadUserPhoto, userController.addUser);
router
    .route('/')
    .delete(userController.deleteUsers);

router
    .route('/:id')
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

router.use(authController.restrictTo('Admin', 'Moderator'));

router
    .route('/:grade')
    .get(userController.getAllUsers)


router.route('/review/:id').patch(userController.review);

module.exports = router;
