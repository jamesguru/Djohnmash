import StaffAttendance from '../models/Attendance.js';
import { format, parseISO, isToday, differenceInHours, differenceInMinutes} from 'date-fns';

// Get all staff attendance records
export const getAllStaffAttendance = async (req, res) => {
  try {
    const { date, search } = req.query;
    
    let query = {};
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    if (search) {
      query.staffName = { $regex: search, $options: 'i' };
    }
    
    const staff = await StaffAttendance.find(query).sort({ createdAt: -1 });
    
    // Transform data for frontend
    const transformedStaff = staff.map(record => ({
      id: record._id,
      staffName: record.staffName,
      staffAvatar: record.staffAvatar,
      position: record.position,
      date: record.formattedDate,
      timeIn: record.formattedTimeIn,
      timeOut: record.formattedTimeOut,
      hoursWorked: record.hoursWorked ? record.hoursWorked.toString() : null,
      status: record.status
    }));
    
    res.json(transformedStaff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check in staff member
export const checkInStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    
    const staff = await StaffAttendance.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (staff.timeIn && staff.timeIn >= today) {
      return res.status(400).json({ message: 'Staff member already checked in today' });
    }
    
    staff.timeIn = new Date();
    staff.date = new Date(); // Update date to today
    
    await staff.save();
    
    res.json({
      id: staff._id,
      staffName: staff.staffName,
      staffAvatar: staff.staffAvatar,
      position: staff.position,
      date: staff.formattedDate,
      timeIn: staff.formattedTimeIn,
      timeOut: staff.formattedTimeOut,
      hoursWorked: staff.hoursWorked,
      status: staff.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check out staff member
export const checkOutStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    
    const staff = await StaffAttendance.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    if (!staff.timeIn) {
      return res.status(400).json({ message: 'Staff member has not checked in' });
    }
    
    if (staff.timeOut) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (staff.timeOut >= today) {
        return res.status(400).json({ message: 'Staff member already checked out today' });
      }
    }
    
    staff.timeOut = new Date();
    await staff.save();
    
    res.json({
      id: staff._id,
      staffName: staff.staffName,
      staffAvatar: staff.staffAvatar,
      position: staff.position,
      date: staff.formattedDate,
      timeIn: staff.formattedTimeIn,
      timeOut: staff.formattedTimeOut,
      hoursWorked: staff.hoursWorked,
      status: staff.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new staff member
export const addStaff = async (req, res) => {
  try {
    const { staffName, position, staffAvatar } = req.body;
    
    if (!staffName || !position) {
      return res.status(400).json({ message: 'Staff name and position are required' });
    }
    
    const newStaff = new StaffAttendance({
      staffName,
      date: Date.now(),
      position,
      staffAvatar: staffAvatar || "/avatars/default.jpg",
      status: "absent"
    });
    
    await newStaff.save();
    
    res.status(201).json({
      id: newStaff._id,
      staffName: newStaff.staffName,
      staffAvatar: newStaff.staffAvatar,
      position: newStaff.position,
      date: newStaff.formattedDate,
      timeIn: newStaff.formattedTimeIn,
      timeOut: newStaff.formattedTimeOut,
      hoursWorked: newStaff.hoursWorked,
      status: newStaff.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance statistics
export const getAttendanceStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const stats = await StaffAttendance.aggregate([
      {
        $match: {
          date: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          totalStaff: { $sum: 1 },
          present: {
            $sum: {
              $cond: [
                { $in: ["$status", ["present", "late"]] },
                1,
                0
              ]
            }
          },
          late: {
            $sum: {
              $cond: [
                { $eq: ["$status", "late"] },
                1,
                0
              ]
            }
          },
          absent: {
            $sum: {
              $cond: [
                { $eq: ["$status", "absent"] },
                1,
                0
              ]
            }
          },
          working: {
            $sum: {
              $cond: [
                { $and: [
                  { $ne: ["$timeIn", null] },
                  { $eq: ["$timeOut", null] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalStaff: 1,
          present: 1,
          late: 1,
          absent: 1,
          working: 1,
          presentPercentage: {
            $multiply: [
              { $divide: ["$present", "$totalStaff"] },
              100
            ]
          },
          absentPercentage: {
            $multiply: [
              { $divide: ["$absent", "$totalStaff"] },
              100
            ]
          }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalStaff: 0,
      present: 0,
      late: 0,
      absent: 0,
      working: 0,
      presentPercentage: 0,
      absentPercentage: 0
    };
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};