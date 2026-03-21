const express = require('express');
const router = express.Router();
const { register , login} = require('../controllers/authController');
const blockIfAuthenticated = require('../middleware/blockIfAuthenticated');

router.post('/register', blockIfAuthenticated , register);
router.post('/login',  login);

module.exports = router;
