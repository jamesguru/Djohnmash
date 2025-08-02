"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { addService, getServices, deleteService } from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Service {
  _id: string;
  name: string;
  date: string;
  service: string;
  amount: number;
  tip: number;
  payoutPercentage?: number;
  payoutAmount: number;
}

const MassageServiceListPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    service: "",
    amount: "",
    date: "",
    tip: "",
    payoutPercentage: "",
  });

  useLayoutEffect(() => {
    const checkAdminStatus = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const role =
            user?.role ||
            user?.user?.role ||
            user?.data?.role ||
            user?.data?.user?.role;
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

  useEffect(() => {
    setRows(services);
  }, [services]);

  const handleDelete = async (id: string) => {
    try {
      await deleteService(id);
      toast.success("Service deleted successfully.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete service.");
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Therapist", width: 180 },
    { field: "service", headerName: "Service Offered", width: 200 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "amount", headerName: "Amount (Ksh)", width: 120 },
    { field: "tip", headerName: "Tip Left (Ksh)", width: 120 },
    { field: "payoutPercentage", headerName: "Payout %", width: 100 },
    { field: "payoutAmount", headerName: "Payout Amount (Ksh)", width: 150 },
    ...(isAdmin
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: 120,
            renderCell: (params:any) => (
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(params.row._id)}
              >
                Delete
              </button>
            ),
          },
        ]
      : []),
  ];

  const filteredRows = rows.filter((row) => {
    const matchesName = row.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesDate =
      (!filterStartDate || row.date >= filterStartDate) &&
      (!filterEndDate || row.date <= filterEndDate);
    return matchesName && matchesDate;
  });

  const handleAddService = async () => {
    const { name, service, amount, date, tip, payoutPercentage } = newService;
    if (!name || !service || !amount || !date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const numericAmount = Number(amount);
      const numericTip = Number(tip) || 0;
      const numericPayoutPercentage = payoutPercentage ? Number(payoutPercentage) : null;
      const payoutAmount =
        numericPayoutPercentage !== null
          ? (numericAmount * numericPayoutPercentage) / 100
          : numericAmount;

      const addedService = await addService({
        name,
        date,
        amount: numericAmount,
        tip: numericTip,
        service,
        payoutPercentage: numericPayoutPercentage,
        payoutAmount,
      });

      setServices([...services, addedService]);
      setIsOpen(false);
      toast.success("Service has been added to the database.");
    } catch (error) {
      toast.error("Failed to add service. Check input fields.");
    }
  };

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

      doc.setFont("DancingScript");
      doc.setFontSize(20);
      doc.setTextColor("#000000");
      doc.text("Nancy", 14, 270);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Director of Spa", 14, 280);
      doc.save("NiccyDjons_services.pdf");
    };
  };

  return (
    <div className="bg-white p-6 rounded-md flex-1 m-4 mt-0 shadow relative">
      <ToastContainer />
      <h2 className="font-bold mb-4 text-xl">NiccyDjons Services</h2>
      <div className="mb-4 space-x-2">
        <input type="text" placeholder="Search by Therapist" value={filterName} onChange={(e) => setFilterName(e.target.value)} className="border rounded px-3 py-2" />
        <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="border rounded px-3 py-2" />
        <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="border rounded px-3 py-2" />
        <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Discount %" className="border rounded px-3 py-2" />
      </div>

      <DataGrid rows={filteredRows} columns={columns} getRowId={(row) => row._id} checkboxSelection sortingOrder={["asc", "desc"]} />

      <div className="fixed bottom-8 right-8 flex space-x-4">
        <button onClick={() => setIsOpen(true)} className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
          + Add Service
        </button>
        {isAdmin && (
          <button onClick={generatePDF} className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg">
            Export to PDF
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end">
          <div className="bg-white p-6 w-96 h-full shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Service</h3>
            {["name", "service", "amount", "date", "tip", "payoutPercentage"].map((field) => (
              <input
                key={field}
                type={field === "date" ? "date" : "text"}
                placeholder={field === "payoutPercentage" ? "Payout % (optional)" : field}
                value={(newService as any)[field]}
                onChange={(e) => setNewService({ ...newService, [field]: e.target.value })}
                className="border rounded px-3 py-2 mb-4 w-full"
              />
            ))}
            <div className="flex justify-between">
              <button onClick={() => setIsOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded shadow">
                Cancel
              </button>
              <button onClick={handleAddService} className="bg-green-500 text-white px-4 py-2 rounded shadow">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MassageServiceListPage;
