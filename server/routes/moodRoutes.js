const router = require('express').Router();
const moodController = require('../controllers/moodController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, moodController.addMood);
router.get('/', auth, moodController.getMoods);

module.exports = router;
