const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintCode: {
    type: String,
    unique: true
  },
  submittedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Population'
  }],
  category: {
    type: String,
    enum: ['environment', 'security', 'infrastructure', 'social', 'other'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['received', 'in_progress', 'resolved', 'rejected'],
    default: 'received'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  mergedFrom: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }],
  isMerged: {
    type: Boolean,
    default: false
  },
  mergedInto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  },
  statusHistory: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  resolution: String,
  resolvedDate: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

// Auto-generate complaint code
complaintSchema.pre('save', async function(next) {
  if (!this.complaintCode) {
    const count = await this.constructor.countDocuments();
    this.complaintCode = `KN${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
