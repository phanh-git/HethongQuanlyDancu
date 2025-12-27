const mongoose = require('mongoose');

const populationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  alias: String,
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  idNumber: {
    type: String,
    unique: true,
    sparse: true // Allow null for newborns
  },
  idIssueDate: Date,
  idIssuePlace: String,
  nationality: {
    type: String,
    default: 'Việt Nam'
  },
  ethnicity: {
    type: String,
    default: 'Kinh'
  },
  religion: String,
  nativePlace: {
    province: String,
    district: String,
    ward: String
  },
  occupation: String,
  education: {
    type: String,
    enum: ['primary', 'secondary', 'high_school', 'college', 'university', 'postgraduate', 'other']
  },
  household: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    required: true
  },
  relationshipToHead: {
    type: String,
    enum: ['head', 'spouse', 'child', 'parent', 'sibling', 'other'],
    required: true
  },
  residenceStatus: {
    type: String,
    enum: ['permanent', 'temporary', 'temporarily_absent'],
    default: 'permanent'
  },
  permanentResidenceDate: Date,
  previousAddress: {
    type: String,
    default: 'Mới sinh' // Default for newborns
  },
  isNewborn: {
    type: Boolean,
    default: false
  },
  isDead: {
    type: Boolean,
    default: false
  },
  deathDate: Date,
  deathReason: String,
  hasMovedOut: {
    type: Boolean,
    default: false
  },
  moveOutDate: Date,
  moveOutDestination: String,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Calculate age
populationSchema.virtual('age').get(function() {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Get age category
populationSchema.virtual('ageCategory').get(function() {
  const age = this.age;
  if (age < 6) return 'preschool';
  if (age < 18) return 'student';
  if (age < 60) return 'working';
  return 'retired';
});

populationSchema.set('toJSON', { virtuals: true });
populationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Population', populationSchema);
