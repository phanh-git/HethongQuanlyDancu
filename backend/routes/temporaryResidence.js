const express = require('express');
const router = express.Router();
const {
  getTemporaryResidences,
  getTemporaryResidence,
  createTemporaryResidence,
  extendTemporaryResidence,
  cancelTemporaryResidence,
  getExpiringResidences
} = require('../controllers/temporaryResidenceController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getTemporaryResidences);
router.get('/expiring', auth, getExpiringResidences);
router.get('/:id', auth, getTemporaryResidence);
router.post('/', auth, authorize('admin', 'team_leader', 'deputy_leader', 'staff'), createTemporaryResidence);
router.post('/:id/extend', auth, authorize('admin', 'team_leader', 'deputy_leader'), extendTemporaryResidence);
router.post('/:id/cancel', auth, authorize('admin', 'team_leader', 'deputy_leader'), cancelTemporaryResidence);

module.exports = router;
