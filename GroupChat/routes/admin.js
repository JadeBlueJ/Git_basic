const path = require('path');

// const auth = require('../middleware/auth')

const express = require('express');

const signupController = require('../controllers/signup');
const loginController = require('../controllers/login')




const router = express.Router();


router.post('/signup',signupController.postUser)
router.post('/login',loginController.checkUser)
module.exports = router





