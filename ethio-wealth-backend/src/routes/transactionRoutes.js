const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.use(authMiddleware);

router.get('/categories', transactionController.getCategories);
router.get('/summary', transactionController.getSummary);
router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
