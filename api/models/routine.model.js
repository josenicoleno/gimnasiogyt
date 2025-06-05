import mongoose from 'mongoose';

const routineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  file: {
    type: String,
    /* required: true */
  },
  startDate: {
    type: Date,
    /* required: true */
  },
  endDate: {
    type: Date,
    /* required: true */
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'],
    default: 'Draft'
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Routine = mongoose.model('Routine', routineSchema);

export default Routine; 