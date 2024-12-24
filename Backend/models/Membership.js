import mongoose from 'mongoose';
const membershipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    startDate: { type: String, default: Date.now },
    isActive: { type: Boolean, default: true },
  });

  const Membership = mongoose.model('Membership', membershipSchema);
  export default Membership;