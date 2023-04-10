const path = require('path');

const auth = require('../middleware/auth')

const express = require('express');

const signupController = require('../controllers/signup');
const loginController = require('../controllers/login')
const adminController = require('../controllers/admin');



const router = express.Router();

router.post('/user/signup',signupController.postUser)
router.post('/user/login',loginController.checkUser)
router.post('/expense/add-expense',auth.authenticate,adminController.postExpense)
router.get('/expense/get-expense',auth.authenticate,adminController.getExpense)
// router.get('/expense/filter',adminController.getExpense)
router.delete('/expense/delete-expense/:id',auth.authenticate,adminController.deleteExpense)

module.exports = router





