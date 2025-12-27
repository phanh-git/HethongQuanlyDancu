const express = require('express');
const router = express.Router();
const {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaintStatus,
  mergeComplaints,
  assignComplaint,
  getComplaintStats
} = require('../controllers/complaintController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getComplaints);
router.get('/stats', auth, getComplaintStats);
router.get('/:id', auth, getComplaint);
router.post('/', auth, createComplaint);
router.put('/:id/status', auth, authorize('admin', 'team_leader', 'deputy_leader'), updateComplaintStatus);
router.post('/merge', auth, authorize('admin', 'team_leader', 'deputy_leader'), mergeComplaints);
router.put('/:id/assign', auth, authorize('admin', 'team_leader', 'deputy_leader'), assignComplaint);

module.exports = router;
