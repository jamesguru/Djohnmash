import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: '/equipment/default.jpg'
  },
  lastMaintenance: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['checked-in', 'checked-out', 'maintenance', 'missing'],
    default: 'checked-out'
  },
  checkedBy: {
    type: String,
    default: null
  },
  checkTime: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add indexes for frequently queried fields
equipmentSchema.index({ name: 1 });
equipmentSchema.index({ status: 1 });
equipmentSchema.index({ addedDate: 1 });

const Equipment = mongoose.model('Equipment', equipmentSchema);

export default Equipment;