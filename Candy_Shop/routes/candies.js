const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/shop/add-candy',adminController.postCandy)

router.get('/shop/get-candies',adminController.getCandies)

router.get('/shop/get-candy/:id',adminController.getCandy)

router.put('/shop/update-candy-1/:id',adminController.updateCandy1)

router.put('/shop/update-candy-2/:id',adminController.updateCandy2)

router.put('/shop/update-candy-3/:id',adminController.updateCandy3)

router.delete('/shop/delete-candy/:id',adminController.deleteCandy)

module.exports = router