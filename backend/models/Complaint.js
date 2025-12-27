const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  complaintCode: {
    type: DataTypes.STRING,
    unique: true
  },
  submitterName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  submitterPhone: {
    type: DataTypes.STRING
  },
  submitterAddress: {
    type: DataTypes.STRING
  },
  submissionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ComplaintCategories',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('submitted', 'acknowledged', 'forwarded', 'answered'),
    defaultValue: 'submitted'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  mergedFrom: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: []
  },
  isMerged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  mergedIntoId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Complaints',
      key: 'id'
    }
  },
  statusHistory: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  resolution: {
    type: DataTypes.TEXT
  },
  resolvedDate: {
    type: DataTypes.DATE
  },
  resolvedById: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  assignedToId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  attachments: {
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
  hooks: {
    beforeCreate: async (complaint) => {
      if (!complaint.complaintCode) {
        const count = await Complaint.count();
        complaint.complaintCode = `KN${String(count + 1).padStart(6, '0')}`;
      }
    }
  }
});

module.exports = Complaint;
