// models/Service.js
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  tip: { type: Number, default: 0 },
  service: { type: String, required: true },
  payoutPercentage: { type: Number },
  payoutAmount: { type: Number, required: true },
  
},
  {
    timestamps: true,
  });

const Service = mongoose.model('service', serviceSchema);
export default Service;
