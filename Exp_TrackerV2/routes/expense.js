const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/expense/add-expense',adminController.postExpense)

router.get('/expense/get-expense',adminController.getExpense)

router.delete('/expense/delete-expense/:id',adminController.deleteExpense)

module.exports = router