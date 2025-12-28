const jwt = require('jsonwebtoken');
const { User, Population } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Helper: Tạo Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1d'
  });
};

// @desc    Register user (Dành cho người dân)
const register = async (req, res) => {
  try {
    const { username, password, fullName, email, phone, citizenIdentificationCard } = req.body;

    // // Kiểm tra CCCD có trong danh sách dân cư không
    // const citizen = await Population.findOne({ where: { idNumber: citizenIdentificationCard } });
    // if (!citizen) {
    //   return res.status(400).json({ message: 'Số CCCD không tồn tại trong hệ thống dân cư.' });
    // }

    // Check trùng
    const userExists = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username }, 
          { email },
          { citizenIdentificationCard }
        ] 
      } 
    });

    if (userExists) {
      return res.status(400).json({ message: 'Người dùng đã tồn tại (Username/Email/CCCD)' });
    }

    // Tạo user với role mặc định là resident
    const user = await User.create({
      username,
      password, // Password sẽ tự hash nếu bạn có hooks trong model
      fullName,
      email,
      phone,
      role: 'resident',
      citizenIdentificationCard
    });

    res.status(201).json({
      success: true,
      token: generateToken(user.id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create staff account (Dành cho Admin)
const createStaffAccount = async (req, res) => {
  try {
    const { username, password, role, fullName, email } = req.body;
    
    // Hash password thủ công nếu model không tự làm
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStaff = await User.create({
      username,
      password: hashedPassword,
      role, 
      fullName,
      email,
      isActive: true
    });

    res.status(201).json({ message: "Tạo tài khoản cán bộ thành công", username: newStaff.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại hoặc đã bị khóa' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
    }

    user.lastLogin = new Date();
    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user.id, user.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export theo kiểu CommonJS
module.exports = {
  register,
  login,
  getMe,
  createStaffAccount
};