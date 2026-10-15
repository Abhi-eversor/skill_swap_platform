const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { getMe, updateMe } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, updateMe);

module.exports = router;
