const Population = require('../models/Population');
const Household = require('../models/Household');
const { Op } = require('sequelize');
// @desc    Get all population
// @route   GET /api/population
// @access  Private

exports.getPopulation = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      residenceStatus,
      ageCategory,
      gender 
    } = req.query;

    const offset = (page - 1) * limit;

    // 1. Xây dựng điều kiện WHERE
    const whereConditions = {
      isDead: false,
      hasMovedOut: false
    };

    // Tìm kiếm (ILIKE cho Postgres để không phân biệt hoa thường)
    if (search) {
      whereConditions[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { idNumber: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Các bộ lọc khác
    if (residenceStatus) whereConditions.residenceStatus = residenceStatus;
    if (gender) whereConditions.gender = gender;
    if (ageCategory) whereConditions.ageCategory = ageCategory;

    // 2. Truy vấn Database
    const { count, rows } = await Population.findAndCountAll({
      where: whereConditions,
      include: [{
        model: Household,
        as: 'household', // Phải khớp với alias trong định nghĩa association
        attributes: ['householdCode', 'address']
      }],
      order: [['fullName', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      population: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get person by ID
// @route   GET /api/population/:id
// @access  Private
exports.getPerson = async (req, res) => {
  try {
    const person = await Population.findById(req.params.id)
      .populate('household');

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create person
// @route   POST /api/population
// @access  Private
exports.createPerson = async (req, res) => {
  try {
    const personData = req.body;
    personData.createdBy = req.user._id;

    // Check if newborn
    if (personData.isNewborn) {
      personData.previousAddress = 'Mới sinh';
      personData.idNumber = null;
      personData.occupation = null;
    }

    const person = await Population.create(personData);

    // Add to household
    if (personData.household) {
      await Household.findByIdAndUpdate(
        personData.household,
        { 
          $push: { 
            members: person._id,
            history: {
              event: 'member_added',
              description: `Thêm thành viên: ${person.fullName}`
            }
          }
        }
      );
    }

    const populatedPerson = await Population.findById(person._id)
      .populate('household');

    res.status(201).json(populatedPerson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update person
// @route   PUT /api/population/:id
// @access  Private
exports.updatePerson = async (req, res) => {
  try {
    const person = await Population.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    Object.assign(person, req.body);
    await person.save();

    const updatedPerson = await Population.findById(person._id)
      .populate('household');

    res.json(updatedPerson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark person as deceased
// @route   POST /api/population/:id/death
// @access  Private
exports.markAsDeceased = async (req, res) => {
  try {
    const { deathDate, deathReason } = req.body;
    const person = await Population.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    person.isDead = true;
    person.deathDate = deathDate;
    person.deathReason = deathReason;
    await person.save();

    // Update household
    await Household.findByIdAndUpdate(
      person.household,
      {
        $push: {
          history: {
            event: 'member_removed',
            description: `${person.fullName} đã qua đời`
          }
        }
      }
    );

    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark person as moved out
// @route   POST /api/population/:id/moveout
// @access  Private
exports.markAsMovedOut = async (req, res) => {
  try {
    const { moveOutDate, moveOutDestination } = req.body;
    const person = await Population.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    person.hasMovedOut = true;
    person.moveOutDate = moveOutDate;
    person.moveOutDestination = moveOutDestination;
    await person.save();

    // Remove from household members
    await Household.findByIdAndUpdate(
      person.household,
      {
        $pull: { members: person._id },
        $push: {
          history: {
            event: 'member_removed',
            description: `${person.fullName} đã chuyển đi ${moveOutDestination}`
          }
        }
      }
    );

    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete person
// @route   DELETE /api/population/:id
// @access  Private
exports.deletePerson = async (req, res) => {
  try {
    const person = await Population.findById(req.params.id);

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // Remove from household
    await Household.findByIdAndUpdate(
      person.household,
      { $pull: { members: person._id } }
    );

    await person.remove();

    res.json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
