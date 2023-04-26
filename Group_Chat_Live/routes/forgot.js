const express = require('express');

const resetpasswordController = require('../controllers/forgot');


const router = express.Router();

router.get('/password/updatepassword/:resetpasswordid', resetpasswordController.updatePwd)

router.get('/password/resetpassword/:id', resetpasswordController.resetPwd)

router.use('/password/forgotpassword', resetpasswordController.forgotPwd)

module.exports = router;