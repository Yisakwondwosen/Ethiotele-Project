const express = require('express');
const router = express.Router();
const faydaController = require('../controllers/faydaController');

// Mounted at /api/auth
router.get('/fayda/login', faydaController.login);
router.get('/callback/fayda', faydaController.callback);

module.exports = router;
