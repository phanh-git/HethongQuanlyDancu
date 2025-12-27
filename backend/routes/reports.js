const express = require('express');
const router = express.Router();
const {
  generatePopulationByAgeReport,
  generateQuarterlyComplaintReport,
  generateHouseholdReport
} = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

router.get('/population-by-age', auth, generatePopulationByAgeReport);
router.get('/complaints-quarterly', auth, authorize('admin', 'team_leader', 'deputy_leader'), generateQuarterlyComplaintReport);
router.get('/households', auth, generateHouseholdReport);

module.exports = router;
