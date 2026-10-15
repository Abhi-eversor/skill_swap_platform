const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const { listSwaps, getSwap, createSwap, updateSwap } = require('../controllers/swapController');

router.use(requireAuth);
router.get('/', listSwaps);
router.get('/:id', getSwap);
router.post('/', createSwap);
router.patch('/:id', updateSwap);

module.exports = router;
