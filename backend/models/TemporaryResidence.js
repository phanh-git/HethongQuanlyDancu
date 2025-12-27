const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TemporaryResidence = sequelize.define('TemporaryResidence', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  personId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Populations',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('temporary_residence', 'temporary_absence'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'extended', 'cancelled'),
    defaultValue: 'active'
  },
  extensions: {
    type: DataTypes.JSONB,
    defaultValue: []
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
  getterMethods: {
    isExpired() {
      return new Date() > this.endDate;
    },
    isExpiringSoon() {
      const daysUntilExpiry = Math.ceil((this.endDate - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
    }
  }
});

module.exports = TemporaryResidence;
