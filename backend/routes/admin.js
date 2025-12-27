const express = require('express');
const router = express.Router();
const { 
  createStaffAccount, 
  getStaffList, 
  updateStaffStatus,
  updateStaffInfo 
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

// All routes require authentication and admin/team_leader role
router.post('/create-staff', auth, authorize('admin', 'team_leader'), createStaffAccount);
router.get('/staff', auth, authorize('admin', 'team_leader'), getStaffList);
router.put('/staff/:id/status', auth, authorize('admin', 'team_leader'), updateStaffStatus);
router.put('/staff/:id', auth, authorize('admin', 'team_leader'), updateStaffInfo);

module.exports = router;
