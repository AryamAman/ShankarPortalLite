import mongoose from 'mongoose';

const WaterCoolerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Each cooler name (T1, T2) must be unique
    trim: true,
  },
  tds: {
    type: String,
    required: true,
    trim: true,
    default: 'N/A', // Default value
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.WaterCooler || mongoose.model('WaterCooler', WaterCoolerSchema);