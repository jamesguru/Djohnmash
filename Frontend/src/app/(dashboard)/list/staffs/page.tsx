"use client";
import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { format } from 'date-fns-tz';
const TIMEZONE = 'Africa/Nairobi'; // East Africa Time (EAT)
import { Button, Chip, TextField, Avatar, Paper, Typography, Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Divider, IconButton, Fade, Grow, Zoom, } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { parseISO, isToday, differenceInHours, differenceInMinutes, } from "date-fns";
import { AddCircle, Close, AccessTime, PersonAdd, CheckCircle, HighlightOff, TrendingUp, TrendingFlat, TrendingDown, Cancel, Work, Timelapse, Groups, Schedule, Event, Search, } from "@mui/icons-material";
import { getAttendanceStats, getStaffAttendance, addStaffMember, updateCheckoutStatus, updateCheckinStatus, } from "@/services/api";

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

interface NewStaff {
  staffName: string;
  position: string;
  date: any;
  staffAvatar?: string;
}

interface AttendanceStats {
  totalStaff: number;
  present: number;
  late: number;
  absent: number;
  working: number;
  presentPercentage: number;
  absentPercentage: number;
}

const StaffAttendancePage = () => {
  // State management
  const [dateFilter, setDateFilter] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const [staffList, setStaffList] = useState<StaffAttendance[]>([]);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaff, setNewStaff] = useState<NewStaff>({
    staffName: "",
    position: "",
    date: new Date(),
    staffAvatar: "/avatars/default.jpg",
  });
  const [stats, setStats] = useState<AttendanceStats>({
    totalStaff: 0,
    present: 0,
    late: 0,
    absent: 0,
    working: 0,
    presentPercentage: 0,
    absentPercentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching data with params:", {
          date: dateFilter,
          search: searchTerm,
          todayOnly: isToday(dateFilter || new Date()),
        });

        // 1. First verify the API call is being made
        const data = await getStaffAttendance({
          date: dateFilter,
          search: searchTerm,
          todayOnly: isToday(dateFilter || new Date()),
        });
        console.log("Raw API data:", data);
        setStaffList(data);
        console.log("StaffList state:", staffList); // This will show previous state due to async nature
        setStaffList(data);
        setTimeout(() => console.log("Updated StaffList:", staffList), 0);
        setStaffList(data);

        // 2. Verify stats endpoint
        const statsResponse = await fetch(
          `http://localhost:8800/api/v1/attendance/stats`
        );
        console.log("Stats Response status:", statsResponse.status);
        if (!statsResponse.ok) {
          const errorData = await statsResponse.json();
          console.error("Stats API Error:", errorData);
          throw new Error(errorData.message || "Failed to fetch stats");
        }
        const statsData = await statsResponse.json();
        console.log("Stats Response data:", statsData);
        setStats(statsData);
      } catch (error) {
        console.error("Error in fetchData:", error);
        setSnackbar({
          open: true,
          message: error instanceof Error ? error.message : "Failed to load attendance data",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // Time-related code remains the same
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check-in function
  const handleCheckIn = async (staffId: string) => {
    console.log("Attempting check-in for staff ID:", staffId);
    if (!staffId) {
      console.error("No staff ID provided!");
      setSnackbar({
        open: true,
        message: "Staff member identifier is missing",
        severity: "error",
      });
      return;
    }
    try {
      setIsRecording(true);
      setSelectedStaff(staffId);
      const updatedStaff = await updateCheckinStatus(staffId, "check-in");
      setStaffList(
        staffList.map((staff) => (staff.id === staffId ? updatedStaff : staff))
      );
      const statsData = await getAttendanceStats();
      setStats(statsData);
      setSnackbar({
        open: true,
        message: "Checked in successfully",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to check in",
        severity: "error",
      });
    } finally {
      setIsRecording(false);
      setSelectedStaff(null);
    }
  };

  // Check-out function
  const handleCheckOut = async (staffId: string) => {
    try {
      setIsRecording(true);
      setSelectedStaff(staffId);
      const updatedStaff = await updateCheckoutStatus(staffId, "check-out");
      setStaffList(
        staffList.map((staff) => (staff.id === staffId ? updatedStaff : staff))
      );
      const statsData = await getAttendanceStats();
      setStats(statsData);
      setSnackbar({
        open: true,
        message: "Checked out successfully",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to check out",
        severity: "error",
      });
    } finally {
      setIsRecording(false);
      setSelectedStaff(null);
    }
  };

  // Add new staff
  const handleAddStaff = async () => {
    if (!newStaff.staffName || !newStaff.position || !newStaff.date) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "error",
      });
      return;
    }
    try {
      const addedStaff = await addStaffMember({
        ...newStaff,
        date: newStaff.date ? format(newStaff.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
      });
      setStaffList([...staffList, addedStaff]);
      setNewStaff({
        staffName: "",
        position: "",
        date: new Date(),
        staffAvatar: "/avatars/default.jpg",
      });
      setIsAddingStaff(false);
      const statsData = await getAttendanceStats();
      setStats(statsData);
      setSnackbar({
        open: true,
        message: "Staff added successfully",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to add staff",
        severity: "error",
      });
    }
  };

  // Filter staff
  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = staff.staffName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? staff.date === format(dateFilter, "yyyy-MM-dd") : true;
    return matchesSearch && matchesDate;
  });

  // Columns configuration
  const columns: GridColDef[] = [
    {
      field: "staffName",
      headerName: "STAFF MEMBER",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={params.row.staffAvatar}
            alt={params.row.staffName}
            sx={{
              width: 42,
              height: 42,
              boxShadow: 1,
              border: "2px solid white",
            }}
          />
          <Box>
            <Typography fontWeight="medium">{params.row.staffName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {params.row.position}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "timeIn",
      headerName: "CHECK-IN",
      width: 150,
      renderCell: (params) =>
        params.row.timeIn ? (
          <Chip
            label={params.row.timeIn}
            color="primary"
            variant="outlined"
            icon={<CheckCircle fontSize="small" />}
            sx={{
              pl: 1,
              "& .MuiChip-icon": { color: "primary.main" },
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        ) : (
          <Typography color="text.disabled" variant="body2">
            Not checked in
          </Typography>
        ),
    },
    {
      field: "timeOut",
      headerName: "CHECK-OUT",
      width: 150,
      renderCell: (params) =>
        params.row.timeOut ? (
          <Chip
            label={params.row.timeOut}
            color="secondary"
            variant="outlined"
            icon={<HighlightOff fontSize="small" />}
            sx={{
              pl: 1,
              "& .MuiChip-icon": { color: "secondary.main" },
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        ) : (
          <Typography color="text.disabled" variant="body2">
            Not checked out
          </Typography>
        ),
    },
    {
      field: "hoursWorked",
      headerName: "HOURS",
      width: 120,
      renderCell: (params) =>
        params.row.hoursWorked ? (
          <Chip
            label={`${params.row.hoursWorked}h`}
            sx={{
              backgroundColor: "primary.light",
              color: "primary.dark",
              fontWeight: "medium",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        ) : (
          <Typography color="text.disabled" variant="body2">
            -
          </Typography>
        ),
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 140,
      renderCell: (params) => {
        const statusConfig = {
          present: {
            label: "Present",
            color: "success.main",
            icon: <CheckCircle fontSize="small" />,
          },
          absent: {
            label: "Absent",
            color: "error.main",
            icon: <Cancel fontSize="small" />,
          },
          late: {
            label: "Late",
            color: "warning.main",
            icon: <AccessTime fontSize="small" />,
          },
          "left-early": {
            label: "Left Early",
            color: "info.main",
            icon: <Schedule fontSize="small" />,
          },
        };
        const status = statusConfig[params.row.status as keyof typeof statusConfig];
        return (
          <Chip
            label={status.label}
            icon={status.icon}
            size="small"
            variant="filled"
            sx={{
              fontWeight: "medium",
              backgroundColor: status.color,
              color: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 220,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {!params.row.timeIn ? (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleCheckIn(params.row.id)}
              disabled={isRecording && selectedStaff === params.row.id}
              startIcon={<AccessTime />}
              sx={{
                textTransform: "none",
                px: 2,
                fontWeight: "medium",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {isRecording && selectedStaff === params.row.id
                ? "Processing..."
                : "Check In"}
            </Button>
          ) : !params.row.timeOut ? (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleCheckOut(params.row.id)}
              disabled={isRecording && selectedStaff === params.row.id}
              startIcon={<AccessTime />}
              sx={{
                textTransform: "none",
                px: 2,
                fontWeight: "medium",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {isRecording && selectedStaff === params.row.id
                ? "Processing..."
                : "Check Out"}
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              disabled
              sx={{
                textTransform: "none",
                px: 2,
                fontWeight: "medium",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              Shift Complete
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        p: 3,
        bgcolor: "background.default",
        background: "linear-gradient(to bottom, #f5f7fa 0%, #e4e8ed 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          p: 3,
          borderRadius: 2,
          background: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            <Groups
              sx={{ verticalAlign: "middle", mr: 1, color: "primary.main" }}
            />
            Staff Attendance
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" color="text.secondary">
              <Event sx={{ verticalAlign: "middle", mr: 1 }} />
              {currentTime ? format(currentTime, "EEEE, MMMM d, yyyy") : ""}
            </Typography>
            {currentTime && (
              <Typography variant="body1" color="text.secondary">
                <Schedule sx={{ verticalAlign: "middle", mr: 1 }} />
                {format(currentTime, "h:mm a")}
              </Typography>
            )}
          </Box>
        </Box>
        <Zoom in={true}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAdd />}
            onClick={() => setIsAddingStaff(true)}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(63,81,181,0.2)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(63,81,181,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Add Staff
          </Button>
        </Zoom>
      </Box>

      {/* Filters */}
      <Grow in={true}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            background: "white",
          }}
        >
          <Box display="flex" gap={3} alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={dateFilter}
                onChange={(newValue) => setDateFilter(newValue)}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <Event sx={{ mr: 1, color: "action.active" }} />
                      ),
                    },
                  },
                }}
                sx={{ flex: 1 }}
              />
            </LocalizationProvider>
            <TextField
              label="Search staff members"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
              sx={{ flex: 2 }}
            />
            <Button
              variant="outlined"
              size="medium"
              onClick={() => {
                setDateFilter(new Date());
                setSearchTerm("");
              }}
              sx={{
                height: "40px",
                textTransform: "none",
                borderRadius: 2,
                px: 3,
              }}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      </Grow>

      {/* Stats Cards */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "1fr 1fr",
          md: "repeat(4, 1fr)",
        }}
        gap={3}
        mb={4}
      >
        {/* Present Today Card */}
        <Fade in={true} timeout={500}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 24px rgba(76,175,80,0.3)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            <Box position="absolute" top={-20} right={-20} sx={{ opacity: 0.1 }}>
              <CheckCircle sx={{ fontSize: 100 }} />
            </Box>
            <Typography variant="subtitle2" mb={0.5} sx={{ opacity: 0.9 }}>
              Present Today
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
              {stats.present}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUp sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {Math.round(stats.presentPercentage)}% of staff
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Late Today Card */}
        <Fade in={true} timeout={800}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: "linear-gradient(135deg, #FFA000 0%, #FFCA28 100%)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 24px rgba(255,160,0,0.3)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            <Box position="absolute" top={-20} right={-20} sx={{ opacity: 0.1 }}>
              <AccessTime sx={{ fontSize: 100 }} />
            </Box>
            <Typography variant="subtitle2" mb={0.5} sx={{ opacity: 0.9 }}>
              Late Today
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
              {stats.late}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingFlat sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Avg. {stats.late > 0 ? "15" : "0"} mins late
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Absent Today Card */}
        <Fade in={true} timeout={1100}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: "linear-gradient(135deg, #F44336 0%, #E57373 100%)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 24px rgba(244,67,54,0.3)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            <Box position="absolute" top={-20} right={-20} sx={{ opacity: 0.1 }}>
              <Cancel sx={{ fontSize: 100 }} />
            </Box>
            <Typography variant="subtitle2" mb={0.5} sx={{ opacity: 0.9 }}>
              Absent Today
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
              {stats.absent}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingDown sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {Math.round(stats.absentPercentage)}% of staff
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Currently Working Card with Pulse Animation */}
        <Fade in={true} timeout={1400}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              background: "linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              color: "white",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 8px 24px rgba(33,150,243,0.3)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            <Box
              position="absolute"
              top={-20}
              right={-20}
              sx={{
                opacity: 0.1,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.1)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            >
              <Work sx={{ fontSize: 100 }} />
            </Box>
            <Typography variant="subtitle2" mb={0.5} sx={{ opacity: 0.9 }}>
              Currently Working
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
              {stats.working}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Timelapse sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Avg. {stats.working > 0 ? "6.5" : "0"} hrs today
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Box>

      {/* Data Grid */}
      <Grow in={true}>
        <Paper
          sx={{
            flex: 1,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: "white",
            minHeight: "400px",
            height: "calc(100vh - 600px)",
          }}
        >
          <DataGrid
            rows={filteredStaff}
            getRowId={(row) => row.id}
            columns={columns}
            loading={isLoading}
            autoHeight={false}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
              },
            }}
            sx={{
              "& .MuiDataGrid-virtualScroller": {
                minHeight: "200px",
              },
              "& .MuiDataGrid-cell": {
                py: 2,
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "background.paper",
                borderBottom: "2px solid",
                borderColor: "divider",
                fontWeight: "bold",
                fontSize: "0.875rem",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 700,
                color: "text.primary",
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              flex: 1,
              border: "none",
              "& .MuiDataGrid-toolbarContainer": {
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              },
            }}
          />
        </Paper>
      </Grow>

      {/* Add Staff Dialog */}
      <Dialog
        open={isAddingStaff}
        onClose={() => setIsAddingStaff(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              <PersonAdd
                sx={{ verticalAlign: "middle", mr: 1, color: "primary.main" }}
              />
              Add New Staff Member
            </Typography>
            <IconButton
              onClick={() => setIsAddingStaff(false)}
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} py={2}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={newStaff.staffName}
              onChange={(e) =>
                setNewStaff({ ...newStaff, staffName: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <Groups sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
            <TextField
              label="Position"
              variant="outlined"
              fullWidth
              value={newStaff.position}
              onChange={(e) =>
                setNewStaff({ ...newStaff, position: e.target.value })
              }
              InputProps={{
                startAdornment: <Work sx={{ mr: 1, color: "action.active" }} />,
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={newStaff.date}
                onChange={(newValue) =>
                  setNewStaff({ ...newStaff, date: newValue })
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <Event sx={{ mr: 1, color: "action.active" }} />
                      ),
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setIsAddingStaff(false)}
            sx={{
              textTransform: "none",
              px: 3,
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddStaff}
            startIcon={<AddCircle />}
            sx={{
              textTransform: "none",
              px: 3,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(63,81,181,0.2)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(63,81,181,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Add Staff
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: 2,
            alignItems: "center",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StaffAttendancePage;