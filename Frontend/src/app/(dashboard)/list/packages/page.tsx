"use client";
import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Chip, TextField, Avatar, Paper, Typography, Box, Snackbar, Alert } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO, isToday, differenceInHours, differenceInMinutes } from "date-fns";

interface StaffAttendance {
  id: string;
  staffName: string;
  staffAvatar: string;
  position: string;
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  hoursWorked: string | null;
  status: "present" | "absent" | "late" | "left-early";
}

const StaffAttendancePage = () => {
  // State for filters and form
  const [dateFilter, setDateFilter] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [staffList, setStaffList] = useState<StaffAttendance[]>([]);

  // Initialize with dummy data or from localStorage
  useEffect(() => {
    const savedStaff = localStorage.getItem("staffAttendance");
    if (savedStaff) {
      setStaffList(JSON.parse(savedStaff));
    } else {
      // Default dummy data
      const dummyData: StaffAttendance[] = [
        {
          id: "1",
          staffName: "Sarah Johnson",
          staffAvatar: "/avatars/sarah.jpg",
          position: "Senior Masseuse",
          date: format(new Date(), "yyyy-MM-dd"),
          timeIn: null,
          timeOut: null,
          hoursWorked: null,
          status: "absent"
        },
        // ... other staff members (similar structure)
      ];
      setStaffList(dummyData);
      localStorage.setItem("staffAttendance", JSON.stringify(dummyData));
    }
  }, []);

  // Save to localStorage whenever staffList changes
  useEffect(() => {
    if (staffList.length > 0) {
      localStorage.setItem("staffAttendance", JSON.stringify(staffList));
    }
  }, [staffList]);

  // Handle check-in
  const handleCheckIn = (staffId: string) => {
    setIsRecording(true);
    setSelectedStaff(staffId);
    
    const updatedStaff = staffList.map(staff => {
      if (staff.id === staffId) {
        const now = new Date();
        const timeIn = format(now, "hh:mm a");
        let status: "present" | "late" = "present";
        
        // If checking in after 9:00 AM, mark as late
        if (now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0)) {
          status = "late";
        }
        
        return {
          ...staff,
          date: format(now, "yyyy-MM-dd"),
          timeIn,
          timeOut: null,
          hoursWorked: null,
          status
        };
      }
      return staff;
    });
    
    setTimeout(() => {
      setStaffList(updatedStaff);
      setIsRecording(false);
      setSelectedStaff(null);
      setSnackbar({ open: true, message: "Checked in successfully", severity: "success" });
    }, 1000);
  };

  // Handle check-out
  const handleCheckOut = (staffId: string) => {
    setIsRecording(true);
    setSelectedStaff(staffId);
    
    const updatedStaff = staffList.map(staff => {
      if (staff.id === staffId && staff.timeIn) {
        const now = new Date();
        const timeOut = format(now, "hh:mm a");
        
        // Calculate hours worked
        const timeInDate = new Date(`${staff.date} ${staff.timeIn}`);
        const hours = differenceInHours(now, timeInDate);
        const minutes = differenceInMinutes(now, timeInDate) % 60;
        const hoursWorked = `${hours}.${Math.floor(minutes / 6)}`; // Convert minutes to decimal
        
        let status = staff.status;
        // If checking out before 5:00 PM, mark as left-early
        if (now.getHours() < 17) {
          status = "left-early";
        }
        
        return {
          ...staff,
          timeOut,
          hoursWorked,
          status
        };
      }
      return staff;
    });
    
    setTimeout(() => {
      setStaffList(updatedStaff);
      setIsRecording(false);
      setSelectedStaff(null);
      setSnackbar({ open: true, message: "Checked out successfully", severity: "success" });
    }, 1000);
  };

  // Add new staff member
  const [newStaff, setNewStaff] = useState({
    staffName: "",
    position: "",
    staffAvatar: "/avatars/default.jpg"
  });
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const handleAddStaff = () => {
    if (!newStaff.staffName || !newStaff.position) {
      setSnackbar({ open: true, message: "Please fill all fields", severity: "error" });
      return;
    }
    
    const staff: StaffAttendance = {
      id: `staff-${Date.now()}`,
      staffName: newStaff.staffName,
      position: newStaff.position,
      staffAvatar: newStaff.staffAvatar,
      date: format(new Date(), "yyyy-MM-dd"),
      timeIn: null,
      timeOut: null,
      hoursWorked: null,
      status: "absent"
    };
    
    setStaffList([...staffList, staff]);
    setNewStaff({ staffName: "", position: "", staffAvatar: "/avatars/default.jpg" });
    setIsAddingStaff(false);
    setSnackbar({ open: true, message: "Staff added successfully", severity: "success" });
  };

  // Filter staff based on search and date
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? staff.date === format(dateFilter, "yyyy-MM-dd") : true;
    return matchesSearch && matchesDate;
  });

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Columns for the data grid
  const columns: GridColDef[] = [
    // ... (same column definitions as before)
    // Update the actions column to use handleCheckIn/CheckOut
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 250,
      renderCell: (params) => (
        <div className="flex space-x-3">
          {!params.row.timeIn ? (
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={() => handleCheckIn(params.row.id)}
              disabled={isRecording && selectedStaff === params.row.id}
              sx={{ padding: '8px 16px', textTransform: 'none', fontSize: '0.875rem' }}
            >
              {isRecording && selectedStaff === params.row.id ? "Processing..." : "Check In"}
            </Button>
          ) : !params.row.timeOut ? (
            <Button
              variant="contained"
              color="secondary"
              size="medium"
              onClick={() => handleCheckOut(params.row.id)}
              disabled={isRecording && selectedStaff === params.row.id}
              sx={{ padding: '8px 16px', textTransform: 'none', fontSize: '0.875rem' }}
            >
              {isRecording && selectedStaff === params.row.id ? "Processing..." : "Check Out"}
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="medium"
              disabled
              sx={{ padding: '8px 16px', textTransform: 'none', fontSize: '0.875rem' }}
            >
              Shift Completed
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', p: 4, bgcolor: '#f9fafb' }}>
      {/* Header with Add Staff button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 1 }}>
            Staff Attendance
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Track and manage staff working hours
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setIsAddingStaff(true)}
          sx={{ height: '48px' }}
        >
          Add New Staff
        </Button>
      </Box>

      {/* Add Staff Dialog */}
      {isAddingStaff && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Add New Staff Member</Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Staff Name"
              variant="outlined"
              fullWidth
              value={newStaff.staffName}
              onChange={(e) => setNewStaff({...newStaff, staffName: e.target.value})}
            />
            <TextField
              label="Position"
              variant="outlined"
              fullWidth
              value={newStaff.position}
              onChange={(e) => setNewStaff({...newStaff, position: e.target.value})}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setIsAddingStaff(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleAddStaff}
            >
              Add Staff
            </Button>
          </Box>
        </Paper>
      )}

      {/* Rest of the components (Filters, Stats, DataGrid) remain the same */}
      {/* ... */}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({...snackbar, open: false})} 
    
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StaffAttendancePage;