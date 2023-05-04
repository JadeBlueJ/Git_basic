const path = require('path');

const auth = require('../middleware/auth')

const express = require('express');

const signupController = require('../controllers/signup');
const loginController = require('../controllers/login')
// const adminController = require('../controllers/admin');



const router = express.Router();

router.post('/user/signup',signupController.postUser)
router.post('/user/login',loginController.checkUser)

module.exports = router





