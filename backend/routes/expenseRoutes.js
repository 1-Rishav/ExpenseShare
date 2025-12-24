const express = require('express');
const router = express.Router();
const { addExpense, getGroupExpenses, getGroupBalance, settleDebt } = require('../controllers/expenseController');

router.route('/').post(addExpense);
router.route('/group/:groupId').get(getGroupExpenses);
router.route('/group/:groupId/balance').get(getGroupBalance);
router.route('/settle').post(settleDebt);

module.exports = router;
