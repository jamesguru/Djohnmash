import express from 'express';
const router = express.Router();
import {getAllStaffAttendance, getAttendanceStats, checkInStaff, checkOutStaff, addStaff} from '../controllers/attendanceController.js';

// Get all staff attendance with optional date and search filters
router.get('/', getAllStaffAttendance);

// Check in staff member
router.put('/:staffId/checkin', checkInStaff);

// Check out staff member
router.put('/:staffId/checkout', checkOutStaff);

// Add new staff member
router.post('/', addStaff);

// Get attendance statistics
router.get('/stats', getAttendanceStats);

export default  router;