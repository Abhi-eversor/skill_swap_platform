const router = require('express').Router();
const { listUsers, getUser } = require('../controllers/userController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', listUsers);
router.get('/:id', optionalAuth, getUser);

module.exports = router;
