"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { addService, getServices, deleteService, updateService } from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField, Chip } from "@mui/material";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from "date-fns";

interface Service {
  _id: string;
  name: string;
  date: string;
  service: string;
  amount: number;
  tip: number;
  payoutPercentage?: number;
  payoutAmount: number;
  isEdited?: boolean;
  createdAt?: string;
}

const MassageServiceListPage = () => {
  // State management
  const [services, setServices] = useState<Service[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [filterName, setFilterName] = useState("");
  const [filterOption, setFilterOption] = useState("today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [discount, setDiscount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    service: "",
    amount: "",
    date: "",
    tip: "",
    payoutPercentage: "",
  });

  // Check admin status
  useLayoutEffect(() => {
    const checkAdminStatus = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const role = user?.role || user?.user?.role || user?.data?.role || user?.data?.user?.role;
          setIsAdmin(role === "admin");
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
    window.addEventListener("storage", checkAdminStatus);
    return () => window.removeEventListener("storage", checkAdminStatus);
  }, []);

  // Fetch services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchServices = await getServices();
        setServices(fetchServices);
        setRows(fetchServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchData();
  }, []);

  // Update rows when services change
  useEffect(() => {
    setRows(services);
  }, [services]);

  // Delete service handler
  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      toast.success("Service deleted successfully.");
      setServices(services.filter((s) => s._id !== id));
    } catch {
      toast.error("Failed to delete service.");
    }
  };

  // Edit service handler
  const handleEdit = (service: Service) => {
    setEditId(service._id);
    setIsEditing(true);
    setIsOpen(true);
    setNewService({
      name: service.name,
      service: service.service,
      amount: service.amount.toString(),
      date: service.date,
      tip: service.tip.toString(),
      payoutPercentage: service.payoutPercentage?.toString() ?? "",
    });
  };

  // Add or update service handler
  const handleAddOrUpdateService = async () => {
    const { name, service, amount, date, tip, payoutPercentage } = newService;
    if (!name || !service || !amount || !date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const numericAmount = Number(amount);
      const numericTip = Number(tip) || 0;
      const numericPayoutPercentage = payoutPercentage ? Number(payoutPercentage) : null;
      const payoutAmount = numericPayoutPercentage !== null ? (numericAmount * numericPayoutPercentage) / 100 : numericAmount;

      if (isEditing && editId) {
        const updated = await updateService(editId, {
          name,
          service,
          amount: numericAmount,
          date,
          tip: numericTip,
          payoutPercentage: numericPayoutPercentage,
          payoutAmount,
          isEdited: "Edited",
        });
        setServices(services.map((s) => (s._id === editId ? updated : s)));
        toast.success("Service updated successfully.");
      } else {
        const addedService = await addService({
          name,
          service,
          amount: numericAmount,
          date,
          tip: numericTip,
          payoutPercentage: numericPayoutPercentage,
          payoutAmount,
          isEdited: "",
        });
        setServices([...services, addedService]);
        toast.success("Service has been added.");
      }
      setIsOpen(false);
      setIsEditing(false);
      setEditId(null);
      setNewService({
        name: "",
        service: "",
        amount: "",
        date: "",
        tip: "",
        payoutPercentage: "",
      });
    } catch {
      toast.error("Failed to save service.");
    }
  };

  // Table columns configuration
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Therapist",
      width: 200,
      renderCell: (params: any) => (
        <div className="flex items-center gap-2">
          {params.row.name}
          {isAdmin && params.row.isEdited && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
              {params.row.isEdited}
            </span>
          )}
        </div>
      ),
    },
    { field: "service", headerName: "Service Offered", width: 180 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "amount", headerName: "Amount (Ksh)", width: 120 },
    { field: "tip", headerName: "Tip Left (Ksh)", width: 120 },
    { field: "payoutPercentage", headerName: "Payout %", width: 100 },
    { field: "payoutAmount", headerName: "Payout Amount (Ksh)", width: 150 },
    {
      field: "Edited",
      headerName: "Update",
      width: 100,
      renderCell: (params: any) => (
        <button
          className="bg-blue-300 text-white px-3 py-1 rounded"
          onClick={() => handleEdit(params.row)}
        >
          Edit
        </button>
      ),
    },
    ...(isAdmin ? [
      {
        field: "createdAt",
        headerName: "Timestamp",
        width: 220,
        renderCell: (params: any) => {
          const raw = params?.row?.createdAt;
          if (!raw) return "N/A";
          let localTime = "Invalid date";
          try {
            const utc = new Date(raw);
            if (!isNaN(utc.getTime())) {
              const eat = new Date(utc.toLocaleString("en-US", { timeZone: "Africa/Nairobi" }));
              localTime = eat.toLocaleString("en-KE");
            }
          } catch (err) {
            console.error("Error parsing date:", err);
            return "Error parsing";
          }
          return (
            <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded text-sm font-mono">
              {localTime}
            </div>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 180,
        renderCell: (params: any) => (
          <button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </button>
        ),
      }
    ] : []),
  ];

  // Date filtering logic
  const getFilteredDates = () => {
    const today = new Date();
    switch (filterOption) {
      case "today":
        return [format(today, "yyyy-MM-dd")];
      case "yesterday":
        return [format(subDays(today, 1), "yyyy-MM-dd")];
      case "thisWeek":
        const startOfWeek = subDays(today, today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return eachDayOfInterval({ start: startOfWeek, end: endOfWeek }).map(date => format(date, "yyyy-MM-dd"));
      case "thisMonth":
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        return eachDayOfInterval({ start: monthStart, end: monthEnd }).map(date => format(date, "yyyy-MM-dd"));
      case "lastMonth":
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthStart = startOfMonth(lastMonth);
        const lastMonthEnd = endOfMonth(lastMonth);
        return eachDayOfInterval({ start: lastMonthStart, end: lastMonthEnd }).map(date => format(date, "yyyy-MM-dd"));
      case "specificMonth":
        const specificMonth = new Date(selectedYear, selectedMonth, 1);
        const specificMonthStart = startOfMonth(specificMonth);
        const specificMonthEnd = endOfMonth(specificMonth);
        return eachDayOfInterval({ start: specificMonthStart, end: specificMonthEnd }).map(date => format(date, "yyyy-MM-dd"));
      case "custom":
        if (customStartDate && customEndDate) {
          const start = parseISO(customStartDate);
          const end = parseISO(customEndDate);
          return eachDayOfInterval({ start, end }).map(date => format(date, "yyyy-MM-dd"));
        }
        return [];
      default:
        return [];
    }
  };

  // Apply filters to rows
  const filteredRows = rows.filter((row) => {
    const matchesName = row.name.toLowerCase().includes(filterName.toLowerCase());
    if (filterOption === "all") return matchesName;
    const filteredDates = getFilteredDates();
    return matchesName && filteredDates.includes(row.date);
  });

  // PDF generation
  const generatePDF = () => {
    const doc = new jsPDF();
    const imgUrl = "https://res.cloudinary.com/dap91fhxh/image/upload/v1738954676/logo1_nojit1.png";
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const imgWidth = 40;
      const imgHeight = imgWidth / aspectRatio;
      
      doc.addImage(imgUrl, "PNG", 150, 5, imgWidth, imgHeight);
      doc.setFontSize(12);
      doc.text("Address: Uhuru St, opposite Family Bank, Second Floor, Thika", 14, 10);
      doc.text("Phone: 254 757 939 067", 14, 15);
      doc.text("Email: niccydjonsspa@gmail.com", 14, 20);
      
      doc.setTextColor(230, 230, 230);
      doc.setFontSize(50);
      doc.text("NICCYDJONSSPA", 40, 150, { angle: 45 });
      doc.setTextColor("#D4AF37");
      doc.setFontSize(18);
      
      const totalAmount = filteredRows.reduce((sum, row) => sum + row.amount + row.tip, 0);
      const totalPayout = filteredRows.reduce((sum, row) => sum + row.payoutAmount, 0);
      const finalAmount = discount ? totalPayout * (1 - Number(discount) / 100) : totalPayout;
      
      autoTable(doc, {
        head: [["Name", "Service", "Date", "Amount", "Tip", "Payout %", "Payout"]],
        body: filteredRows.map((row) => [
          row.name,
          row.service,
          row.date,
          row.amount,
          row.tip,
          row.payoutPercentage ?? "N/A",
          row.payoutAmount,
        ]),
        startY: imgHeight + 30,
        theme: "grid",
        styles: { fontSize: 12 },
        headStyles: { fillColor: "#000000", textColor: "#D4AF37" },
      });
      
      const finalY = (doc as any).lastAutoTable.finalY || imgHeight + 40;
      doc.setTextColor("#D4AF37");
      doc.setFontSize(14);
      doc.text(`Total Amount: Ksh ${totalAmount}`, 14, finalY + 10);
      doc.text(`Payout Amount: Ksh ${totalPayout}`, 14, finalY + 20);
      if (discount) {
        doc.text(`Discount Applied: ${discount}%`, 14, finalY + 30);
        doc.text(`Final Payout: Ksh ${finalAmount}`, 14, finalY + 40);
      }
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Director of Spa", 14, 280);
      doc.save("NiccyDjons_services.pdf");
    };
  };

  // Filter configuration
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const timeFilterButtons = [
    { label: "Today", value: "today", color: "bg-blue-500 hover:bg-blue-600" },
    { label: "Yesterday", value: "yesterday", color: "bg-purple-500 hover:bg-purple-600" },
    { label: "This Week", value: "thisWeek", color: "bg-green-500 hover:bg-green-600" },
    { label: "This Month", value: "thisMonth", color: "bg-yellow-500 hover:bg-yellow-600" },
    { label: "Last Month", value: "lastMonth", color: "bg-orange-500 hover:bg-orange-600" },
    { label: "Custom Range", value: "custom", color: "bg-red-500 hover:bg-red-600" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <ToastContainer position="top-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">NiccyDjons Services</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsEditing(false);
              setNewService({
                name: "",
                service: "",
                amount: "",
                date: "",
                tip: "",
                payoutPercentage: "",
              });
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition-colors"
          >
            + Add Service
          </button>
          {isAdmin && (
            <button
              onClick={generatePDF}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors"
            >
              Export PDF
            </button>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        {/* Quick Time Filters */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">TIME PERIOD</h3>
          <div className="flex flex-wrap gap-3">
            {timeFilterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilterOption(btn.value)}
                className={`${btn.color} text-white px-4 py-2 rounded-full shadow-sm transition-all ${
                  filterOption === btn.value ? "ring-2 ring-offset-2 ring-gray-400 scale-105" : ""
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Month and Year Selectors */}
        {(filterOption === "specificMonth" || filterOption === "custom") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">SELECT MONTH</h3>
              <div className="flex flex-wrap gap-2">
                {monthNames.map((month, index) => (
                  <Chip
                    key={month}
                    label={month}
                    onClick={() => setSelectedMonth(index)}
                    variant={selectedMonth === index ? "filled" : "outlined"}
                    color={selectedMonth === index ? "primary" : "default"}
                    className="cursor-pointer hover:shadow-md"
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">SELECT YEAR</h3>
              <div className="flex flex-wrap gap-2">
                {years.map((year) => (
                  <Chip
                    key={year}
                    label={year}
                    onClick={() => setSelectedYear(year)}
                    variant={selectedYear === year ? "filled" : "outlined"}
                    color={selectedYear === year ? "secondary" : "default"}
                    className="cursor-pointer hover:shadow-md"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Custom Date Range */}
        {filterOption === "custom" && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">CUSTOM DATE RANGE</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Start Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="bg-white rounded"
              />
              <TextField
                label="End Date"
                type="date"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="bg-white rounded"
              />
            </div>
          </div>
        )}

        {/* Search and Discount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Search Therapist"
            variant="outlined"
            size="small"
            fullWidth
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="bg-white rounded"
          />
          <TextField
            label="Discount Percentage"
            variant="outlined"
            size="small"
            fullWidth
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            InputProps={{ endAdornment: "%" }}
            className="bg-white rounded"
          />
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(row) => row._id}
          checkboxSelection
          sortingOrder={["asc", "desc"]}
          autoHeight
          sx={{
            '& .MuiDataGrid-cell': {
              padding: '10px',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              fontWeight: 'bold',
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#f1f5f9',
            },
          }}
        />
      </div>

      {/* Add/Edit Service Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Service" : "Add New Service"}
            </h2>
            <div className="space-y-4">
              {["name", "service", "amount", "date", "tip", "payoutPercentage"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === "payoutPercentage" ? "Payout % (optional)" : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "date" ? "date" : field === "amount" || field === "tip" || field === "payoutPercentage" ? "number" : "text"}
                    value={(newService as any)[field]}
                    onChange={(e) => setNewService({ ...newService, [field]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsEditing(false);
                  setEditId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateService}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isEditing ? "Update" : "Add"} Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MassageServiceListPage;