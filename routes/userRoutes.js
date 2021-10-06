const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.get('/logout',authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// router.use(authController.protect);

router.get('/:branch&:type', userController.getFiles);

router.patch('/updateMyPassword', authController.updatePassword);

router.post('/', userController.submitFile);

router.get('/scores/:id&:type', userController.getScores);

router.get('/excellentStudents/:grade',userController.excellentStudents)

router.get('/role', userController.getUserRole);

<<<<<<< Updated upstream
// router.use(authController.restrictTo('Admin'));

router.patch('/comment',userController.addComment)
=======
// router.use(authController.restrictTo('admin'));
>>>>>>> Stashed changes

router.post('/addUser', userController.addUser);
router
    .route('/')
    .delete(userController.deleteUsers);

    // userController.uploadUserPhoto,
router
.route('/:id') 
.patch(userController.uploadUserPhoto,userController.resizeUserPhoto,userController.updateUser)
    .delete(userController.deleteUser);
<<<<<<< Updated upstream
    
// router.use(authController.restrictTo('Admin', 'Moderator'));
=======

// router.use(authController.restrictTo('admin', 'moderator'));
>>>>>>> Stashed changes

router
.route('/:grade')
.get(userController.getAllUsers)

router.route('/info/:id').get(userController.getUser);

router.route('/review/:id').patch(userController.review);

    // router.route('/:name').get(userController.getUserByName);
    
module.exports = router;
