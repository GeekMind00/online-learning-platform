const express = require('express');
const fileController = require('./../controllers/fileController');

const router = express.Router();

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