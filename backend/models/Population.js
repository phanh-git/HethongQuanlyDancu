const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Population = sequelize.define('Population', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  alias: {
    type: DataTypes.STRING
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  idNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  idIssueDate: {
    type: DataTypes.DATE
  },
  idIssuePlace: {
    type: DataTypes.STRING
  },
  nationality: {
    type: DataTypes.STRING,
    defaultValue: 'Việt Nam'
  },
  ethnicity: {
    type: DataTypes.STRING,
    defaultValue: 'Kinh'
  },
  religion: {
    type: DataTypes.STRING
  },
  nativePlace: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  occupation: {
    type: DataTypes.STRING
  },
  education: {
    type: DataTypes.ENUM('primary', 'secondary', 'high_school', 'college', 'university', 'postgraduate', 'other')
  },
  householdId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Households',
      key: 'id'
    }
  },
  relationshipToHead: {
    type: DataTypes.ENUM('head', 'spouse', 'child', 'parent', 'sibling', 'other'),
    allowNull: false
  },
  residenceStatus: {
    type: DataTypes.ENUM('permanent', 'temporary', 'temporarily_absent'),
    defaultValue: 'permanent'
  },
  permanentResidenceDate: {
    type: DataTypes.DATE
  },
  previousAddress: {
    type: DataTypes.STRING,
    defaultValue: 'Mới sinh'
  },
  isNewborn: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isDead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deathDate: {
    type: DataTypes.DATE
  },
  deathReason: {
    type: DataTypes.STRING
  },
  hasMovedOut: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  moveOutDate: {
    type: DataTypes.DATE
  },
  moveOutDestination: {
    type: DataTypes.STRING
  },
  notes: {
    type: DataTypes.TEXT
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
  getterMethods: {
    age() {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    ageCategory() {
      const age = this.age;
      if (age < 6) return 'preschool';
      if (age < 18) return 'student';
      if (age < 60) return 'working';
      return 'retired';
    }
  }
});

module.exports = Population;
