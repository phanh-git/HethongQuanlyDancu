const TemporaryResidence = require('../models/TemporaryResidence');
const Population = require('../models/Population');

// @desc    Get all temporary residences
// @route   GET /api/temporary-residence
// @access  Private
exports.getTemporaryResidences = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    const residences = await TemporaryResidence.find(query)
      .populate('person', 'fullName idNumber')
      .sort({ endDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await TemporaryResidence.countDocuments(query);

    res.json({
      residences,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get temporary residence by ID
// @route   GET /api/temporary-residence/:id
// @access  Private
exports.getTemporaryResidence = async (req, res) => {
  try {
    const residence = await TemporaryResidence.findById(req.params.id)
      .populate('person');

    if (!residence) {
      return res.status(404).json({ message: 'Temporary residence not found' });
    }

    res.json(residence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create temporary residence
// @route   POST /api/temporary-residence
// @access  Private
exports.createTemporaryResidence = async (req, res) => {
  try {
    const residenceData = req.body;
    residenceData.createdBy = req.user._id;

    const residence = await TemporaryResidence.create(residenceData);

    // Update population residence status
    await Population.findByIdAndUpdate(
      residenceData.person,
      { 
        residenceStatus: residenceData.type === 'temporary_residence' 
          ? 'temporary' 
          : 'temporarily_absent'
      }
    );

    const populatedResidence = await TemporaryResidence.findById(residence._id)
      .populate('person');

    res.status(201).json(populatedResidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Extend temporary residence
// @route   POST /api/temporary-residence/:id/extend
// @access  Private
exports.extendTemporaryResidence = async (req, res) => {
  try {
    const { newEndDate, reason } = req.body;
    const residence = await TemporaryResidence.findById(req.params.id);

    if (!residence) {
      return res.status(404).json({ message: 'Temporary residence not found' });
    }

    residence.extensions.push({
      previousEndDate: residence.endDate,
      newEndDate,
      reason
    });

    residence.endDate = newEndDate;
    residence.status = 'extended';
    await residence.save();

    const populatedResidence = await TemporaryResidence.findById(residence._id)
      .populate('person');

    res.json(populatedResidence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel temporary residence
// @route   POST /api/temporary-residence/:id/cancel
// @access  Private
exports.cancelTemporaryResidence = async (req, res) => {
  try {
    const residence = await TemporaryResidence.findById(req.params.id);

    if (!residence) {
      return res.status(404).json({ message: 'Temporary residence not found' });
    }

    residence.status = 'cancelled';
    await residence.save();

    // Update population residence status back to permanent
    await Population.findByIdAndUpdate(
      residence.person,
      { residenceStatus: 'permanent' }
    );

    res.json(residence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expiring residences
// @route   GET /api/temporary-residence/expiring
// @access  Private
exports.getExpiringResidences = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const residences = await TemporaryResidence.find({
      status: 'active',
      endDate: {
        $gte: new Date(),
        $lte: endDate
      }
    })
      .populate('person', 'fullName idNumber')
      .sort({ endDate: 1 });

    res.json(residences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
