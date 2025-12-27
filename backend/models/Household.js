const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
  householdCode: {
    type: String,
    required: true,
    unique: true
  },
  householdHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Population',
    required: true
  },
  address: {
    houseNumber: { type: String, required: true },
    street: String,
    ward: String,
    district: String,
    city: String
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Population'
  }],
  history: [{
    date: { type: Date, default: Date.now },
    event: String, // 'created', 'split_from', 'changed_head', 'member_added', 'member_removed'
    description: String,
    relatedHousehold: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Household'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Auto-generate household code
householdSchema.pre('save', async function(next) {
  if (!this.householdCode) {
    const count = await this.constructor.countDocuments();
    this.householdCode = `HK${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Household', householdSchema);
