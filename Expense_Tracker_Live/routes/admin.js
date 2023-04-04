const path = require('path');

const express = require('express');

const signupController = require('../controllers/signup');
const loginController = require('../controllers/login')
const adminController = require('../controllers/admin');


const router = express.Router();

router.post('/user/signup',signupController.postUser)
router.post('/user/login',loginController.checkUser)
router.post('/expense/add-expense',adminController.postExpense)
router.get('/expense/get-expense',adminController.getExpense)
router.delete('/expense/delete-expense/:id',adminController.deleteExpense)

module.exports = router





