const express = require('express');
const router = express.Router();

// 1. Import đầy đủ các hàm từ Controller
const { 
    register, 
    login, 
    getMe, 
    createStaffAccount 
} = require('../controllers/authController');

// 2. Import đầy đủ các middleware và sửa đúng tên
const { auth, authorize } = require('../middleware/auth');

// --- CÁC ROUTE CÔNG KHAI ---
router.post('/register', register);
router.post('/login', login);

// --- CÁC ROUTE CẦN ĐĂNG NHẬP ---
router.get('/me', auth, getMe);

// --- CÁC ROUTE CỦA QUẢN LÝ (CÁCH A) ---
// Thay 'authenticate' bằng 'auth' cho đúng với file middleware của bạn
router.post('/create-staff', auth, authorize('admin', 'team_leader'), createStaffAccount);

module.exports = router;