const { User } = require('../models');
const { Op } = require('sequelize');

// @desc    Create staff account (admin/team_leader only)
// @route   POST /api/admin/create-staff
// @access  Private (admin, team_leader)
exports.createStaffAccount = async (req, res) => {
  try {
    const { username, password, role, fullName, email, phone, assignedArea } = req.body;

    // Validate role - only allow staff, deputy_leader for creation
    const allowedRoles = ['staff', 'deputy_leader'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Chỉ được tạo tài khoản với vai trò Cán bộ hoặc Phó tổ trưởng' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username }, 
          { email }
        ] 
      } 
    });

    if (userExists) {
      return res.status(400).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
    }

    // Create staff account
    const newStaff = await User.create({
      username,
      password,
      role,
      fullName,
      email,
      phone,
      assignedArea: assignedArea || {}
    });

    res.status(201).json({
      message: 'Tạo tài khoản cán bộ thành công',
      staff: {
        id: newStaff.id,
        username: newStaff.username,
        fullName: newStaff.fullName,
        email: newStaff.email,
        role: newStaff.role,
        assignedArea: newStaff.assignedArea
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all staff members
// @route   GET /api/admin/staff
// @access  Private (admin, team_leader)
exports.getStaffList = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      role: {
        [Op.in]: ['staff', 'deputy_leader', 'team_leader', 'admin']
      }
    };

    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.iLike]: `%${search}%` } },
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    const { count, rows: staff } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      staff,
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update staff status (activate/deactivate)
// @route   PUT /api/admin/staff/:id/status
// @access  Private (admin, team_leader)
exports.updateStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const staff = await User.findByPk(id);

    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy cán bộ' });
    }

    // Prevent deactivating yourself
    if (staff.id === req.user.id) {
      return res.status(400).json({ message: 'Không thể vô hiệu hóa tài khoản của chính mình' });
    }

    staff.isActive = isActive;
    await staff.save();

    res.json({
      message: `${isActive ? 'Kích hoạt' : 'Vô hiệu hóa'} tài khoản thành công`,
      staff: {
        id: staff.id,
        username: staff.username,
        fullName: staff.fullName,
        isActive: staff.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update staff information
// @route   PUT /api/admin/staff/:id
// @access  Private (admin, team_leader)
exports.updateStaffInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, assignedArea } = req.body;

    const staff = await User.findByPk(id);

    if (!staff) {
      return res.status(404).json({ message: 'Không tìm thấy cán bộ' });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== staff.email) {
      const emailExists = await User.findOne({ 
        where: { 
          email,
          id: { [Op.ne]: id }
        } 
      });
      
      if (emailExists) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }
    }

    // Update fields
    if (fullName) staff.fullName = fullName;
    if (email) staff.email = email;
    if (phone !== undefined) staff.phone = phone;
    if (assignedArea) staff.assignedArea = assignedArea;

    await staff.save();

    res.json({
      message: 'Cập nhật thông tin cán bộ thành công',
      staff: {
        id: staff.id,
        username: staff.username,
        fullName: staff.fullName,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        assignedArea: staff.assignedArea,
        isActive: staff.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
