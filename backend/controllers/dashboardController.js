const Household = require('../models/Household');
const Population = require('../models/Population');
const TemporaryResidence = require('../models/TemporaryResidence');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStatistics = async (req, res) => {
  try {
    // Total households
    const totalHouseholds = await Household.countDocuments({ status: 'active' });

    // Total population
    const totalPopulation = await Population.countDocuments({ 
      isDead: false, 
      hasMovedOut: false 
    });

    // Temporary residents
    const temporaryResidents = await TemporaryResidence.countDocuments({
      type: 'temporary_residence',
      status: 'active'
    });

    // Temporarily absent
    const temporarilyAbsent = await TemporaryResidence.countDocuments({
      type: 'temporary_absence',
      status: 'active'
    });

    // Population by age category
    const allPopulation = await Population.find({ 
      isDead: false, 
      hasMovedOut: false 
    });
    
    const ageDistribution = {
      preschool: 0,    // < 6
      student: 0,      // 6-17
      working: 0,      // 18-59
      retired: 0       // >= 60
    };

    allPopulation.forEach(person => {
      const age = person.age;
      if (age < 6) ageDistribution.preschool++;
      else if (age < 18) ageDistribution.student++;
      else if (age < 60) ageDistribution.working++;
      else ageDistribution.retired++;
    });

    // Gender distribution
    const genderDistribution = await Population.aggregate([
      { $match: { isDead: false, hasMovedOut: false } },
      { $group: { _id: '$gender', count: { $sum: 1 } } }
    ]);

    // Expiring temporary residences (within 7 days)
    const expiringResidences = await TemporaryResidence.find({
      status: 'active',
      endDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    }).populate('person', 'fullName');

    res.json({
      totalHouseholds,
      totalPopulation,
      temporaryResidents,
      temporarilyAbsent,
      ageDistribution,
      genderDistribution: genderDistribution.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      expiringResidences
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Recent household changes
    const recentHouseholds = await Household.find()
      .sort({ updatedAt: -1 })
      .limit(limit)
      .populate('householdHead', 'fullName')
      .select('householdCode householdHead address updatedAt');

    // Recent population additions
    const recentPopulation = await Population.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('household', 'householdCode')
      .select('fullName dateOfBirth household createdAt');

    res.json({
      recentHouseholds,
      recentPopulation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
