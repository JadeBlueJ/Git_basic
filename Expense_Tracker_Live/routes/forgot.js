const path = require('path');

const auth = require('../middleware/auth')

const express = require('express');

const forgotController = require('../controllers/forgot');

const router = express.Router();

router.post('/password/forgotpassword/:mail',forgotController.forgotPwd)

module.exports = router
