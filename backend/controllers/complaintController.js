const Complaint = require('../models/Complaint');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, priority } = req.query;
    const query = { isMerged: false };

    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'fullName idNumber')
      .populate('assignedTo', 'fullName')
      .populate('mergedFrom', 'complaintCode')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Complaint.countDocuments(query);

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
    const complaint = await Complaint.findById(req.params.id)
      .populate('submittedBy', 'fullName idNumber phone')
      .populate('assignedTo', 'fullName')
      .populate('mergedFrom')
      .populate('statusHistory.updatedBy', 'fullName');

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
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    const complaintData = req.body;
    complaintData.createdBy = req.user._id;
    complaintData.statusHistory = [{
      status: 'received',
      note: 'Phiếu kiến nghị được tiếp nhận',
      updatedBy: req.user._id
    }];

    const complaint = await Complaint.create(complaintData);

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'fullName idNumber');

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
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.statusHistory.push({
      status,
      note,
      updatedBy: req.user._id
    });

    if (status === 'resolved') {
      complaint.resolvedDate = new Date();
      complaint.resolvedBy = req.user._id;
      complaint.resolution = resolution;
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'fullName')
      .populate('statusHistory.updatedBy', 'fullName');

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
    const mainComplaint = await Complaint.findById(mainComplaintId);
    if (!mainComplaint) {
      return res.status(404).json({ message: 'Main complaint not found' });
    }

    // Get all complaints to merge
    const complaintsToMerge = await Complaint.find({
      _id: { $in: complaintIds }
    });

    // Collect all submitters
    const allSubmitters = new Set();
    complaintsToMerge.forEach(complaint => {
      complaint.submittedBy.forEach(submitter => {
        allSubmitters.add(submitter.toString());
      });
    });

    // Update main complaint
    mainComplaint.submittedBy = Array.from(allSubmitters);
    mainComplaint.title = mergedTitle || mainComplaint.title;
    mainComplaint.description = mergedDescription || mainComplaint.description;
    mainComplaint.mergedFrom = complaintIds.filter(id => id !== mainComplaintId);
    await mainComplaint.save();

    // Mark other complaints as merged
    await Complaint.updateMany(
      { _id: { $in: complaintIds.filter(id => id !== mainComplaintId) } },
      { 
        isMerged: true,
        mergedInto: mainComplaintId
      }
    );

    const updatedComplaint = await Complaint.findById(mainComplaint._id)
      .populate('submittedBy', 'fullName idNumber')
      .populate('mergedFrom', 'complaintCode title');

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
    const { assignedTo } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.assignedTo = assignedTo;
    complaint.statusHistory.push({
      status: complaint.status,
      note: 'Phiếu được phân công xử lý',
      updatedBy: req.user._id
    });

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('assignedTo', 'fullName');

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
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalComplaints = await Complaint.countDocuments(query);
    const byStatus = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const byCategory = await Complaint.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const resolvedRate = await Complaint.countDocuments({
      ...query,
      status: 'resolved'
    }) / totalComplaints * 100;

    res.json({
      totalComplaints,
      byStatus: byStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      byCategory: byCategory.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      resolvedRate: resolvedRate.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
