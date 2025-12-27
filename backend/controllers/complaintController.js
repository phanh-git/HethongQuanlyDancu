const { Complaint, ComplaintCategory, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId, status, priority } = req.query;
    const query = { isMerged: false };

    if (categoryId) query.categoryId = categoryId;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const complaints = await Complaint.findAll({
      where: query,
      include: [
        { model: ComplaintCategory, as: 'category' },
        { model: User, as: 'assignedTo', attributes: ['id', 'fullName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: limit * 1,
      offset: (page - 1) * limit
    });

    const count = await Complaint.count({ where: query });

    res.json({
      complaints,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id, {
      include: [
        { model: ComplaintCategory, as: 'category' },
        { model: User, as: 'assignedTo', attributes: ['id', 'fullName'] },
        { model: User, as: 'creator', attributes: ['id', 'fullName'] }
      ]
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create complaint
// @route   POST /api/complaints
// @access  Public/Private
exports.createComplaint = async (req, res) => {
  try {
    const complaintData = req.body;
    
    // If user is authenticated, use their ID
    if (req.user) {
      complaintData.createdById = req.user.id;
    }
    
    // Set initial status and history
    complaintData.status = 'submitted';
    complaintData.statusHistory = [{
      status: 'submitted',
      date: new Date(),
      note: 'Đã phản ánh',
      updatedById: req.user ? req.user.id : null
    }];

    const complaint = await Complaint.create(complaintData);

    const populatedComplaint = await Complaint.findByPk(complaint.id, {
      include: [
        { model: ComplaintCategory, as: 'category' }
      ]
    });

    res.status(201).json(populatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, note, resolution } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Update status
    complaint.status = status;
    
    // Add to status history
    const history = complaint.statusHistory || [];
    history.push({
      status,
      date: new Date(),
      note,
      updatedById: req.user.id
    });
    complaint.statusHistory = history;

    if (status === 'answered') {
      complaint.resolvedDate = new Date();
      complaint.resolvedById = req.user.id;
      complaint.resolution = resolution;
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findByPk(complaint.id, {
      include: [
        { model: ComplaintCategory, as: 'category' },
        { model: User, as: 'assignedTo', attributes: ['id', 'fullName'] }
      ]
    });

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Merge complaints
// @route   POST /api/complaints/merge
// @access  Private
exports.mergeComplaints = async (req, res) => {
  try {
    const { complaintIds, mainComplaintId, mergedTitle, mergedDescription } = req.body;

    // Validate main complaint exists
    const mainComplaint = await Complaint.findByPk(mainComplaintId);
    if (!mainComplaint) {
      return res.status(404).json({ message: 'Main complaint not found' });
    }

    // Get all complaints to merge
    const complaintsToMerge = await Complaint.findAll({
      where: {
        id: { [Op.in]: complaintIds }
      }
    });

    // Update main complaint
    mainComplaint.title = mergedTitle || mainComplaint.title;
    mainComplaint.description = mergedDescription || mainComplaint.description;
    mainComplaint.mergedFrom = complaintIds.filter(id => id !== mainComplaintId);
    await mainComplaint.save();

    // Mark other complaints as merged
    await Complaint.update(
      { 
        isMerged: true,
        mergedIntoId: mainComplaintId
      },
      {
        where: {
          id: { [Op.in]: complaintIds.filter(id => id !== mainComplaintId) }
        }
      }
    );

    const updatedComplaint = await Complaint.findByPk(mainComplaint.id, {
      include: [
        { model: ComplaintCategory, as: 'category' }
      ]
    });

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign complaint
// @route   PUT /api/complaints/:id/assign
// @access  Private
exports.assignComplaint = async (req, res) => {
  try {
    const { assignedToId } = req.body;
    const complaint = await Complaint.findByPk(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.assignedToId = assignedToId;
    
    const history = complaint.statusHistory || [];
    history.push({
      status: complaint.status,
      date: new Date(),
      note: 'Phiếu được phân công xử lý',
      updatedById: req.user.id
    });
    complaint.statusHistory = history;

    await complaint.save();

    const updatedComplaint = await Complaint.findByPk(complaint.id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'fullName'] }
      ]
    });

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint statistics
// @route   GET /api/complaints/stats
// @access  Private
exports.getComplaintStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.createdAt = {
        [Op.gte]: new Date(startDate),
        [Op.lte]: new Date(endDate)
      };
    }

    const totalComplaints = await Complaint.count({ where: query });
    
    const byStatus = await Complaint.findAll({
      where: query,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    const byCategory = await Complaint.findAll({
      where: query,
      attributes: [
        'categoryId',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      include: [
        { model: ComplaintCategory, as: 'category', attributes: ['name'] }
      ],
      group: ['categoryId', 'category.id', 'category.name'],
      raw: true
    });

    const answeredCount = await Complaint.count({
      where: {
        ...query,
        status: 'answered'
      }
    });

    const resolvedRate = totalComplaints > 0 ? (answeredCount / totalComplaints * 100).toFixed(2) : 0;

    res.json({
      totalComplaints,
      byStatus: byStatus.reduce((acc, curr) => {
        acc[curr.status] = parseInt(curr.count);
        return acc;
      }, {}),
      byCategory: byCategory.reduce((acc, curr) => {
        acc[curr['category.name']] = parseInt(curr.count);
        return acc;
      }, {}),
      resolvedRate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint categories
// @route   GET /api/complaints/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await ComplaintCategory.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
