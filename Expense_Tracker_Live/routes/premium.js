const path = require('path');

const auth = require('../middleware/auth')

const express = require('express');

const premiumController = require('../controllers/premium');

const router = express.Router();

router.get('/premium/getLeaderboard',auth.authenticate,premiumController.getBoard)

module.exports = router

