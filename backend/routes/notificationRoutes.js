const express = require('express');
const router = express.Router();
const { notifySeller, getNotifications, deleteNotification } = require('../controller/notificationController');

router.post('/api/notify-seller', notifySeller);
router.get('/api/notifications', getNotifications);
router.delete('/api/notifications/:id', deleteNotification);

module.exports = router;
