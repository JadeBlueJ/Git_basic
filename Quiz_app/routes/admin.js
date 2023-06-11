const path = require('path');
const express = require('express');
const signupController = require('../controllers/signup');
const loginController = require('../controllers/login');

const router = express.Router();

// Serve CSS files
router.get('/styles.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, '../public/css/styles.css'));
});

router.get('/styles_1.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, '../public/css/styles_1.css'));
});

// Serve HTML files
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Handle form submissions
router.post('/signup', signupController.postUser);
router.post('/login', loginController.checkUser);

module.exports = router;
