import mongoose from 'mongoose';
const ratingSchema = new mongoose.Schema({
    user: { type: String, required: true },
    rating: { type: String, required: true, min: 1, max: 5 },
    comment: { type: String },
  });
  
  const Rating = mongoose.model('Rating', ratingSchema);
  export default Rating;

