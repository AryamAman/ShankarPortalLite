import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
    required: [true, 'Please provide your room number.'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please select a complaint category.'],
    enum: [
      'Bathroom',
      'Water Cooler',
      'Room',
      'Electricity',
      'Mess/Food',
      'Internet/Wi-Fi',
      'Hygiene',
      'Furniture',
      'Other',
    ],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the issue.'],
    maxlength: [500, 'Description cannot be more than 500 characters.'],
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);