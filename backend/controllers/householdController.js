const Household = require('../models/Household');
const Population = require('../models/Population');

// @desc    Get all households
// @route   GET /api/households
// @access  Private
exports.getHouseholds = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { status: 'active' };

    if (search) {
      query.$or = [
        { householdCode: { $regex: search, $options: 'i' } },
        { 'address.houseNumber': { $regex: search, $options: 'i' } }
      ];
    }

    const households = await Household.find(query)
      .populate('householdHead', 'fullName dateOfBirth idNumber')
      .populate('members', 'fullName relationshipToHead')
      .sort({ householdCode: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Household.countDocuments(query);

    res.json({
      households,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get household by ID
// @route   GET /api/households/:id
// @access  Private
exports.getHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id)
      .populate('householdHead')
      .populate('members')
      .populate('history.relatedHousehold', 'householdCode');

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    res.json(household);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create household
// @route   POST /api/households
// @access  Private
exports.createHousehold = async (req, res) => {
  try {
    const { householdHead, address, members } = req.body;

    const household = await Household.create({
      householdHead,
      address,
      members: [householdHead, ...members],
      createdBy: req.user._id,
      history: [{
        event: 'created',
        description: 'Hộ khẩu được tạo mới'
      }]
    });

    // Update population records
    await Population.updateMany(
      { _id: { $in: household.members } },
      { household: household._id }
    );

    await Population.findByIdAndUpdate(householdHead, {
      relationshipToHead: 'head'
    });

    const populatedHousehold = await Household.findById(household._id)
      .populate('householdHead')
      .populate('members');

    res.status(201).json(populatedHousehold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Split household
// @route   POST /api/households/:id/split
// @access  Private
exports.splitHousehold = async (req, res) => {
  try {
    const { membersToSplit, newAddress, newHouseholdHead } = req.body;
    const originalHousehold = await Household.findById(req.params.id);

    if (!originalHousehold) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // Validate new household head is in members to split
    if (!membersToSplit.includes(newHouseholdHead)) {
      return res.status(400).json({ message: 'New household head must be in members to split' });
    }

    // Create new household
    const newHousehold = await Household.create({
      householdHead: newHouseholdHead,
      address: newAddress,
      members: membersToSplit,
      createdBy: req.user._id,
      history: [{
        event: 'split_from',
        description: `Tách từ hộ ${originalHousehold.householdCode}`,
        relatedHousehold: originalHousehold._id
      }]
    });

    // Update population records for split members
    await Population.updateMany(
      { _id: { $in: membersToSplit } },
      { household: newHousehold._id }
    );

    await Population.findByIdAndUpdate(newHouseholdHead, {
      relationshipToHead: 'head'
    });

    // Remove split members from original household
    originalHousehold.members = originalHousehold.members.filter(
      member => !membersToSplit.includes(member.toString())
    );

    originalHousehold.history.push({
      event: 'member_removed',
      description: `Tách ${membersToSplit.length} thành viên sang hộ ${newHousehold.householdCode}`,
      relatedHousehold: newHousehold._id
    });

    await originalHousehold.save();

    const populatedNewHousehold = await Household.findById(newHousehold._id)
      .populate('householdHead')
      .populate('members');

    res.status(201).json(populatedNewHousehold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update household
// @route   PUT /api/households/:id
// @access  Private
exports.updateHousehold = async (req, res) => {
  try {
    const { householdHead, address } = req.body;
    const household = await Household.findById(req.params.id);

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    // If changing household head
    if (householdHead && householdHead !== household.householdHead.toString()) {
      const oldHead = await Population.findById(household.householdHead);
      const newHead = await Population.findById(householdHead);

      household.history.push({
        event: 'changed_head',
        description: `Đổi chủ hộ từ ${oldHead.fullName} sang ${newHead.fullName}`
      });

      await Population.findByIdAndUpdate(household.householdHead, {
        relationshipToHead: 'other'
      });

      await Population.findByIdAndUpdate(householdHead, {
        relationshipToHead: 'head'
      });

      household.householdHead = householdHead;
    }

    if (address) {
      household.address = address;
    }

    await household.save();

    const updatedHousehold = await Household.findById(household._id)
      .populate('householdHead')
      .populate('members');

    res.json(updatedHousehold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete household
// @route   DELETE /api/households/:id
// @access  Private
exports.deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }

    household.status = 'inactive';
    await household.save();

    res.json({ message: 'Household deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
