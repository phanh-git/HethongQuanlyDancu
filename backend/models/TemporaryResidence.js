const mongoose = require('mongoose');

const temporaryResidenceSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Population',
    required: true
  },
  type: {
    type: String,
    enum: ['temporary_residence', 'temporary_absence'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  reason: String,
  status: {
    type: String,
    enum: ['active', 'expired', 'extended', 'cancelled'],
    default: 'active'
  },
  extensions: [{
    previousEndDate: Date,
    newEndDate: Date,
    extendedDate: { type: Date, default: Date.now },
    reason: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Check if expired
temporaryResidenceSchema.virtual('isExpired').get(function() {
  return new Date() > this.endDate;
});

// Check if expiring soon (within 7 days)
temporaryResidenceSchema.virtual('isExpiringSoon').get(function() {
  const daysUntilExpiry = Math.ceil((this.endDate - new Date()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
});

temporaryResidenceSchema.set('toJSON', { virtuals: true });
temporaryResidenceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TemporaryResidence', temporaryResidenceSchema);
