const path = require('path');

const express = require('express');

const signupController = require('../controllers/signup');

const router = express.Router();

router.post('/user/signup',signupController.postUser)

// router.get('/user/signup',signupController.getUser)



// router.get('/expense/get-expense',adminController.getExpense)

// router.delete('/expense/delete-expense/:id',adminController.deleteExpense)

module.exports = router