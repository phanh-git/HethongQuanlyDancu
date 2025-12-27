const express = require('express');
const router = express.Router();
const {
  getHouseholds,
  getHousehold,
  createHousehold,
  splitHousehold,
  updateHousehold,
  deleteHousehold
} = require('../controllers/householdController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getHouseholds);
router.get('/:id', auth, getHousehold);
router.post('/', auth, authorize('admin', 'team_leader', 'deputy_leader'), createHousehold);
router.post('/:id/split', auth, authorize('admin', 'team_leader', 'deputy_leader'), splitHousehold);
router.put('/:id', auth, authorize('admin', 'team_leader', 'deputy_leader'), updateHousehold);
router.delete('/:id', auth, authorize('admin', 'team_leader'), deleteHousehold);

module.exports = router;
