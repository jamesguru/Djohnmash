import express from 'express';
import { leaveRating, getRatings } from '../controllers/ratingControllers.js';
const router = express.Router();

router.post('/', leaveRating);
router.get('/', getRatings);

export default router;