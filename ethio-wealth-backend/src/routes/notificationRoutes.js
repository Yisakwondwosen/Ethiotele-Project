const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/', (req, res, next) => notificationController.getNotifications(req, res, next));
router.put('/:id/read', (req, res, next) => notificationController.markAsRead(req, res, next));
router.put('/read-all', (req, res, next) => notificationController.markAllAsRead(req, res, next));

module.exports = router;
