import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  service: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
