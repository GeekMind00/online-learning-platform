const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router
    .route('/get')
    .get(notificationController.getAllNotifications)

router
    .route('/:id')
    .delete(
        notificationController.deleteNotification
    );

module.exports = router;