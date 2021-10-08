const express = require('express');
const fileController = require('./../controllers/fileController');
const notificationController = require('../controllers/notificationController');
const authController = require('./../controllers/authController');



const router = express.Router();

router.use(authController.protect);

router.route('/assignments/:branch&:grade').get(fileController.getAssignments);
router.route('/exams/:branch&:grade').get(fileController.getQuizzes);
router.route('/videos/:branch&:grade').get(fileController.getVideos);
// router.route('/videos/').get(fileController.addFileToVideo);


router
    .route('/')
    .get(fileController.getAllFiles)
    .post(
        fileController.createFile
    );

router
    .route('/s3Url')
    .get(fileController.generateUploadURL);

router
    .route('/:id')
    .get(fileController.getFile)
    .post(fileController.addFileToVideo)
    .patch(
        fileController.updateFile
    )
    .delete(
        fileController.deleteFile
    );



module.exports = router;