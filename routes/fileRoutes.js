const express = require('express');
const fileController = require('./../controllers/fileController');
const notificationController = require('../controllers/notificationController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController')


const router = express.Router();

router.route('/verify/:code').get(fileController.verifyCode);

router.use(authController.protect);

router.route('/assignments/:branch&:grade').get(fileController.getAssignments);
router.route('/exams/:branch&:grade').get(fileController.getQuizzes);
router.route('/videos/:branch&:grade').get(fileController.getVideos);
router.route('/videos/:id').get(fileController.getFile);

router
    .route('/')
    .get(fileController.getAllFiles)
    .post(
        userController.uploadUserPhoto, fileController.createFile
    );

router
    .route('/s3Url')
    .get(fileController.generateUploadURL);

router
    .route('/:id')
    .post(userController.uploadUserPhoto,fileController.addFileToVideo)
    .patch(
        fileController.updateFile
    )
    .delete(
        fileController.deleteFile
    );



module.exports = router;