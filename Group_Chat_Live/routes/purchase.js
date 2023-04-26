const path = require('path');

const auth = require('../middleware/auth')

const express = require('express');

const purchaseController = require('../controllers/purchase');

const router = express.Router();

router.get('/purchase/premiummembership',auth.authenticate,purchaseController.purchasePremium)
router.post('/purchase/updatetxnstatus',auth.authenticate,purchaseController.paymentHandler)
router.get('/purchase/premiumStatus',auth.authenticate,purchaseController.premiumStatus)


module.exports = router

