const express = require('express')
const path = require('path')
const router = express.Router();

const contact_form = require('../controllers/contact')

router.get('/',contact_form.formPage)


module.exports = router