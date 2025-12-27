const express = require('express');
const router = express.Router();
const { getStatistics, getRecentActivities } = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.get('/stats', auth, getStatistics);
router.get('/activities', auth, getRecentActivities);

module.exports = router;
