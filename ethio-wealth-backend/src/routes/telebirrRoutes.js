const express = require('express');
const router = express.Router();
const telebirrController = require('../controllers/telebirrController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/pay', authMiddleware, telebirrController.initiatePayment);

module.exports = router;
