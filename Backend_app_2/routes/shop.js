const path = require('path');

const express = require('express');
const productsController = require('../controllers/products.js')
const router = express.Router();

router.get('/',productsController.getProds  );

module.exports = router;
