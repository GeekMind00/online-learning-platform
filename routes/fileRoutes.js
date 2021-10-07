const express = require('express');
const fileController = require('./../controllers/fileController');
const notificationController = require('../controllers/notificationController');
const authController = require('./../controllers/authController');



const router = express.Router();

router.use(authController.protect);

router.route('/assignments/:branch&:grade').get(fileController.getAssignments);
router.route('/exams/:branch&:grade').get(fileController.getQuizzes);
router.route('/videos/:branch&:grade').get(fileController.getVideos);


router
    .route('/')
    .get(fileController.getAllFiles)
    .post(
        fileController.createFile
    );

router
    .route('/:id')
    .get(fileController.getFile)
    .patch(
        fileController.updateFile
    )
    .delete(
        fileController.deleteFile
    );

module.exports = router;