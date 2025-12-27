const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  complaintCode: {
    type: DataTypes.STRING,
    unique: true
  },
  submittedBy: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  category: {
    type: DataTypes.ENUM('environment', 'security', 'infrastructure', 'social', 'other'),
    allowNull: false
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
    type: DataTypes.ENUM('received', 'in_progress', 'resolved', 'rejected'),
    defaultValue: 'received'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  mergedFrom: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  isMerged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  mergedIntoId: {
    type: DataTypes.UUID,
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
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  assignedToId: {
    type: DataTypes.UUID,
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
    type: DataTypes.UUID,
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
