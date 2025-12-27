const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { 
  createStaffAccount, 
  getStaffList, 
  updateStaffStatus,
  updateStaffInfo 
} = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

// Rate limiter for admin routes - prevent abuse
const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all admin routes
router.use(adminRateLimiter);

// All routes require authentication and admin/team_leader role
router.post('/create-staff', auth, authorize('admin', 'team_leader'), createStaffAccount);
router.get('/staff', auth, authorize('admin', 'team_leader'), getStaffList);
router.put('/staff/:id/status', auth, authorize('admin', 'team_leader'), updateStaffStatus);
router.put('/staff/:id', auth, authorize('admin', 'team_leader'), updateStaffInfo);

module.exports = router;
