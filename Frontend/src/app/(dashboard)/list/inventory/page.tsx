"use client";
import {
  getEquipment,
  addEquipment,
  updateEquipmentStatus,
  getEquipmentStats
} from '@/services/api';

import React, { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridValueFormatter,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Button,
  Chip,
  TextField,
  Avatar,
  Paper,
  Typography,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Fade,
  Grow,
  Zoom,
  ChipProps,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parseISO, isToday } from "date-fns";
import {
  AddCircle,
  Close,
  CheckCircle,
  HighlightOff,
  TrendingUp,
  TrendingFlat,
  TrendingDown,
  Cancel,
  Build,
  Timelapse,
  Devices,
  Inventory,
  Search,
  Event,
  Schedule,
  Today,
} from "@mui/icons-material";

// Types
type EquipmentStatus = "checked-in" | "checked-out" | "maintenance" | "missing";

interface Equipment {
  id: string;
  _id?: any;
  name: string;
  type: string;
  image: string;
  lastMaintenance: string;
  status: EquipmentStatus;
  checkedBy: string | null;
  checkTime: string | null;
  notes: string | null;
  addedDate: string;
}

interface NewEquipment {
  name: string;
  type: string;
  image: string;
  lastMaintenance: string;
}

type SnackbarState = {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

const EquipmentCheckInPage = () => {
  // State management
  const [dateFilter, setDateFilter] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"check-in" | "maintenance" | "missing" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);
  const [newEquipment, setNewEquipment] = useState<NewEquipment>({
    name: "",
    type: "",
    image: "/equipment/default.jpg",
    lastMaintenance: format(new Date(), "yyyy-MM-dd"),
  });
  const [notes, setNotes] = useState("");
  const [showTodayOnly, setShowTodayOnly] = useState(true);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);

  // Load equipment data
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getEquipment({ todayOnly: showTodayOnly });
        setEquipmentList(data);
        setFilteredEquipment(data);
      } catch (err) {
        console.error("Failed to load equipment data", err);
        setSnackbar({
          open: true,
          message: "Failed to load equipment data",
          severity: "error"
        });
      }
    };
    loadData();
  }, [showTodayOnly]);

  // Filter equipment based on search and date
  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const data = await getEquipment({
          date: dateFilter,
          search: searchTerm,
          todayOnly: showTodayOnly
        });
        setFilteredEquipment(data);
      } catch (err) {
        console.error("Failed to filter equipment", err);
      }
    };
    fetchFilteredData();
  }, [dateFilter, searchTerm, showTodayOnly, equipmentList]);

  // Timer for clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Status config
  const statusConfig: Record<
    EquipmentStatus,
    {
      label: string;
      color: ChipProps["color"];
      icon: React.ReactNode;
    }
  > = {
    "checked-in": {
      label: "Checked In",
      color: "success",
      icon: <CheckCircle fontSize="small" />,
    },
    "checked-out": {
      label: "Checked Out",
      color: "warning",
      icon: <HighlightOff fontSize="small" />,
    },
    maintenance: {
      label: "Maintenance",
      color: "error",
      icon: <Build fontSize="small" />,
    },
    missing: {
      label: "Missing",
      color: "default",
      icon: <Cancel fontSize="small" />,
    },
  };

  // Handle equipment status update
  const handleStatusUpdate = async () => {
    if (!selectedEquipmentId || !pendingAction) return;

    setIsProcessing(true);
    
    try {
      const updatedEquipment = await updateEquipmentStatus(
        selectedEquipmentId,
        pendingAction,
        notes,
        "niccydjons380@gmail.com"
      );
      
      // Update the equipment list
      setEquipmentList(prev => 
        prev.map(item => item.id === selectedEquipmentId ? updatedEquipment : item)
      );

      // Show success message
      setSnackbar({
        open: true,
        message:
          pendingAction === "check-in"
            ? "Equipment checked in successfully"
            : pendingAction === "maintenance"
            ? "Equipment marked for maintenance"
            : "Equipment reported missing",
        severity:
          pendingAction === "missing"
            ? "warning"
            : pendingAction === "maintenance"
            ? "info"
            : "success",
      });

      // Close the dialog
      setSelectedEquipmentId(null);
      setPendingAction(null);
      setNotes("");

    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to update equipment status",
        severity: "error"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Open action dialog
  const openActionDialog = (
    id: string,
    action: "check-in" | "maintenance" | "missing"
  ) => {
    setSelectedEquipmentId(id);
    setPendingAction(action);
    setNotes("");
  };

  // Add new equipment
  const handleAddEquipment = async () => {
    if (!newEquipment.name.trim() || !newEquipment.type.trim()) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    try {
      const equipment = await addEquipment(newEquipment);
      setEquipmentList(prev => [...prev, equipment]);
      setNewEquipment({
        name: "",
        type: "",
        image: "/equipment/default.jpg",
        lastMaintenance: format(new Date(), "yyyy-MM-dd"),
      });
      setIsAddingEquipment(false);
      setSnackbar({
        open: true,
        message: "Equipment added successfully",
        severity: "success",
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to add equipment",
        severity: "error",
      });
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const checkedInToday = equipmentList.filter((e) => {
      if (e.status !== "checked-in" || !e.checkTime) return false;
      try {
        return isToday(parseISO(e.checkTime));
      } catch {
        return false;
      }
    }).length;

    const maintenanceDueSoon = equipmentList.filter((e) => {
      const lastMaint = new Date(e.lastMaintenance + "T00:00:00");
      const daysSince = (Date.now() - lastMaint.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 25 && e.status !== "maintenance";
    }).length;

   return {
  checkedInToday,
  maintenanceCount: equipmentList.filter((e) => e.status === "maintenance").length,
  missingCount: equipmentList.filter((e) => e.status === "missing").length,
  maintenanceDueSoon,
  checkedInPercentage: equipmentList.length
    ? Math.round((equipmentList.filter((e) => e.status === "checked-in").length / equipmentList.length) * 100)
    : 0,
  missingPercentage: equipmentList.length
    ? Math.round((equipmentList.filter((e) => e.status === "missing").length / equipmentList.length) * 100)
    : 0
};
  }, [equipmentList]);

  // Columns configuration
  const columns: GridColDef<Equipment>[] = [
    {
      field: "name",
      headerName: "EQUIPMENT",
      width: 250,
      renderCell: (params: GridRenderCellParams<Equipment>) => (
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={params.row.image}
            alt={params.row.name}
            sx={{
              width: 42,
              height: 42,
              boxShadow: 1,
              border: "2px solid white",
            }}
          />
          <Box>
            <Typography fontWeight="medium">{params.row.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {params.row.type}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 160,
      renderCell: (params: GridRenderCellParams<Equipment>) => {
        const status = params.row.status;
        const config = statusConfig[status];
        return (
          <Chip
            label={config.label}
            color={config.color}
            size="small"
            variant="filled"
            sx={{
              fontWeight: "medium",
              color: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        );
      },
    },
    {
      field: "checkedBy",
      headerName: "CHECKED BY",
      width: 170,
      renderCell: (params: GridRenderCellParams<Equipment>) =>
        params.row.checkedBy ? (
          <Typography variant="body2">{params.row.checkedBy}</Typography>
        ) : (
          <Typography color="text.disabled" variant="body2">
            Not checked
          </Typography>
        ),
    },
    {
      field: "checkTime",
      headerName: "TIME",
      width: 140,
      valueFormatter: (params: { value?: string | null }) => {
        if (!params || params.value == null) return "-";
        try {
          return format(parseISO(params.value), "h:mm a");
        } catch (error) {
          console.error("Error formatting date:", error);
          return "Invalid date";
        }
      },
    },
    {
      field: "addedDate",
      headerName: "ADDED DATE",
      width: 150,
      valueFormatter: (params: { value?: string | null }) => {
        if (!params || params.value == null) return "-";
        try {
          return format(parseISO(params.value), "MMM d, yyyy");
        } catch (error) {
          console.error("Error formatting date:", error);
          return "Invalid date";
        }
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 500,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<Equipment>) => (
        <Box display="flex" gap={1}>
          {params.row.status !== "checked-in" ? (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => openActionDialog(params.row._id, "check-in")}
              disabled={isProcessing && selectedEquipmentId === params.row._id}
              startIcon={<CheckCircle />}
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
              {isProcessing && selectedEquipmentId === params.row._id
                ? "Processing..."
                : "Check In"}
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
              Already Checked In
            </Button>
          )}
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => openActionDialog(params.row._id, "maintenance")}
            disabled={isProcessing && selectedEquipmentId === params.row._id}
            startIcon={<Build />}
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
            Maintenance
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => openActionDialog(params.row._id, "missing")}
            disabled={isProcessing && selectedEquipmentId === params.row._id}
            startIcon={<Cancel />}
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
            Missing
          </Button>
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
            <Inventory
              sx={{ verticalAlign: "middle", mr: 1, color: "primary.main" }}
            />
            Equipment Check-In
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" color="text.secondary">
              <Event sx={{ verticalAlign: "middle", mr: 1 }} />
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <Schedule sx={{ verticalAlign: "middle", mr: 1 }} />
              {format(currentTime, "h:mm a")}
            </Typography>
          </Box>
        </Box>
        <Zoom in>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            onClick={() => setIsAddingEquipment(true)}
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
            Add Equipment
          </Button>
        </Zoom>
      </Box>

      {/* Filters */}
      <Grow in>
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
                onChange={setDateFilter}
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
              label="Search equipment"
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
                setShowTodayOnly(true);
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
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }}
        gap={3}
        mb={4}
      >
        {/* Checked In Card */}
        <Fade in timeout={500}>
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
              Checked In Today
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
              {stats.checkedInToday}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUp sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {stats.checkedInPercentage}% of equipment
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Maintenance Needed Card */}
        <Fade in timeout={800}>
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
              <Build sx={{ fontSize: 100 }} />
            </Box>
            <Typography variant="subtitle2" mb={0.5} sx={{ opacity: 0.9 }}>
              Maintenance Needed
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
              {stats.maintenanceCount}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingFlat sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Avg. {stats.maintenanceCount > 0 ? "5" : "0"} days overdue
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Missing Equipment Card */}
        <Fade in timeout={1100}>
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
              Missing Equipment
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
              {stats.missingCount}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingDown sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {stats.missingPercentage}% of inventory
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Maintenance Due Soon Card */}
        <Fade in timeout={1400}>
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
              <Timelapse sx={{ fontSize: 100 }} />
            </Box>
            <Typography variant="subtitle2" mb={0.5} sx={{ opacity: 0.9 }}>
              Maintenance Due Soon
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
              {stats.maintenanceDueSoon}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Timelapse sx={{ fontSize: 18 }} />
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {stats.maintenanceDueSoon > 0
                  ? "Schedule soon"
                  : "All up to date"}
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Box>

      {/* Data Grid */}
      <Grow in>
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
            rows={filteredEquipment}
            columns={columns}
            getRowId={(row) => row._id}
            autoHeight={false}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: false,
              },
            }}
            sx={{
              "& .MuiDataGrid-virtualScroller": { minHeight: "200px" },
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

      {/* Status Update Dialog */}
      <Dialog
        open={!!pendingAction}
        onClose={() => !isProcessing && (setSelectedEquipmentId(null), setPendingAction(null), setNotes(""))}
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
          <Typography variant="h6" fontWeight="bold">
            {pendingAction === "check-in"
              ? "Check In"
              : pendingAction === "maintenance"
              ? "Mark Maintenance"
              : "Report Missing"}{" "}
            — Add Notes
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} py={2}>
            <TextField
              label="Notes"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any notes about the equipment status..."
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              if (isProcessing) return;
              setSelectedEquipmentId(null);
              setPendingAction(null);
              setNotes("");
            }}
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
            color={
              pendingAction === "missing"
                ? "error"
                : pendingAction === "maintenance"
                ? "warning"
                : "primary"
            }
            onClick={handleStatusUpdate}
            disabled={isProcessing}
            startIcon={
              pendingAction === "check-in" ? (
                <CheckCircle />
              ) : pendingAction === "maintenance" ? (
                <Build />
              ) : (
                <Cancel />
              )
            }
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
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Equipment Dialog */}
      <Dialog
        open={isAddingEquipment}
        onClose={() => setIsAddingEquipment(false)}
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
              <Devices
                sx={{ verticalAlign: "middle", mr: 1, color: "primary.main" }}
              />
              Add New Equipment
            </Typography>
            <IconButton
              onClick={() => setIsAddingEquipment(false)}
              sx={{ "&:hover": { backgroundColor: "action.hover" } }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} py={2}>
            <TextField
              label="Equipment Name"
              variant="outlined"
              fullWidth
              value={newEquipment.name}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, name: e.target.value })
              }
              required
              InputProps={{
                startAdornment: (
                  <Inventory sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
            <TextField
              label="Equipment Type"
              variant="outlined"
              fullWidth
              value={newEquipment.type}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, type: e.target.value })
              }
              required
              InputProps={{
                startAdornment: (
                  <Build sx={{ mr: 1, color: "action.active" }} />
                ),
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Last Maintenance Date"
                value={new Date(newEquipment.lastMaintenance + "T00:00:00")}
                onChange={(newValue) => {
                  if (newValue)
                    setNewEquipment({
                      ...newEquipment,
                      lastMaintenance: format(newValue, "yyyy-MM-dd"),
                    });
                }}
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
            onClick={() => setIsAddingEquipment(false)}
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
            onClick={handleAddEquipment}
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
            Add Equipment
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

export default EquipmentCheckInPage;