const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// CORE REQUIREMENT: No auth applied for username-only profiles
router.post('/', profileController.createProfile);
router.get('/:username', profileController.getProfile);

module.exports = router;
