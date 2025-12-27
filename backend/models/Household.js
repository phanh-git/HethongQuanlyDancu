const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Household = sequelize.define('Household', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  householdCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  householdHeadId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Populations',
      key: 'id'
    }
  },
  address: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {}
  },
  history: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  createdById: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (household) => {
      if (!household.householdCode) {
        const count = await Household.count();
        household.householdCode = `HK${String(count + 1).padStart(6, '0')}`;
      }
    }
  }
});

module.exports = Household;
