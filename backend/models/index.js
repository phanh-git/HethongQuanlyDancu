const { sequelize } = require('../config/database');
const User = require('./User');
const Household = require('./Household');
const Population = require('./Population');
const TemporaryResidence = require('./TemporaryResidence');
const Complaint = require('./Complaint');

// Define associations

// User associations
User.hasMany(Household, { foreignKey: 'createdById', as: 'createdHouseholds' });
User.hasMany(Population, { foreignKey: 'createdById', as: 'createdPopulation' });
User.hasMany(TemporaryResidence, { foreignKey: 'createdById', as: 'createdResidences' });
User.hasMany(Complaint, { foreignKey: 'createdById', as: 'createdComplaints' });
User.hasMany(Complaint, { foreignKey: 'assignedToId', as: 'assignedComplaints' });
User.hasMany(Complaint, { foreignKey: 'resolvedById', as: 'resolvedComplaints' });

// Household associations
Household.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });
Household.belongsTo(Population, { foreignKey: 'householdHeadId', as: 'householdHead' });
Household.hasMany(Population, { foreignKey: 'householdId', as: 'members' });

// Population associations
Population.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });
Population.belongsTo(Household, { foreignKey: 'householdId', as: 'household' });
Population.hasMany(TemporaryResidence, { foreignKey: 'personId', as: 'temporaryResidences' });

// TemporaryResidence associations
TemporaryResidence.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });
TemporaryResidence.belongsTo(Population, { foreignKey: 'personId', as: 'person' });

// Complaint associations
Complaint.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });
Complaint.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedTo' });
Complaint.belongsTo(User, { foreignKey: 'resolvedById', as: 'resolvedBy' });
Complaint.belongsTo(Complaint, { foreignKey: 'mergedIntoId', as: 'mergedInto' });

module.exports = {
  sequelize,
  User,
  Household,
  Population,
  TemporaryResidence,
  Complaint
};
