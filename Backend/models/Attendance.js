import mongoose from "mongoose";

const staffAttendanceSchema = new mongoose.Schema({
  staffName: { type: String, required: true },
  staffAvatar: { type: String, default: "/avatars/default.jpg" },
  position: { type: String, required: true },
  date: { type: Date, required: true},
  timeIn: { type: Date },
  timeOut: { type: Date },
  hoursWorked: { type: Number },
  status: { 
    type: String, 
    enum: ["present", "absent", "late", "left-early"], 
    default: "absent" 
  }
}, { timestamps: true });

// Virtual for formatted date (YYYY-MM-DD)
staffAttendanceSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Virtual for formatted timeIn (hh:mm a)
staffAttendanceSchema.virtual('formattedTimeIn').get(function() {
  return this.timeIn ? this.timeIn.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }) : null;
});

// Virtual for formatted timeOut (hh:mm a)
staffAttendanceSchema.virtual('formattedTimeOut').get(function() {
  return this.timeOut ? this.timeOut.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }) : null;
});

// Calculate hours worked when timeOut is set
staffAttendanceSchema.pre('save', function(next) {
  if (this.timeOut && this.timeIn) {
    const diffMs = this.timeOut - this.timeIn;
    this.hoursWorked = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    
    // Update status if left early (before 5pm)
    const leftEarlyHour = 17; // 5pm
    if (this.timeOut.getHours() < leftEarlyHour) {
      this.status = "left-early";
    }
  }
  
  // Set status to present if checking in
  if (this.timeIn && !this.timeOut && this.status === "absent") {
    const lateHour = 9; // 9am
    this.status = this.timeIn.getHours() > lateHour ? "late" : "present";
  }
  
  next();
});

const Attendance = mongoose.model('StaffAttendance', staffAttendanceSchema);
export default Attendance;

