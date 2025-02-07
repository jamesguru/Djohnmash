"use client";

import { useState, useEffect } from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { addService, getServices } from "@/services/api";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify"

interface Service {
  _id: string;
  name: string;
  date: string;
  service: string;
  amount: number;
  tip: number;
}

const MassageServiceListPage = () => {
   const [services, setServices] = useState<Service[]>([]);

  const [rows, setRows] = useState<GridRowsProp>(services);

  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [newService, setNewService] = useState({ name: "", service: "", amount: "", date: "", tip: "" });

  const columns: GridColDef[] = [
    { field: "name", headerName: "Therapist", width: 180 },
    { field: "service", headerName: "Service Offered", width: 200 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "amount", headerName: "Amount (Ksh)", width: 120 },
    { field: "tip", headerName: "Tip Left (Ksh)", width: 120 },
  ];

  const filteredRows = rows.filter((row) => {
    const matchesName = row.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesDate = (!filterStartDate || row.date >= filterStartDate) && (!filterEndDate || row.date <= filterEndDate);
    return matchesName && matchesDate;
  });

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (Number(value) < 0) return;
    setDiscount(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchServices = await getServices();
        setServices(fetchServices);
        setRows(fetchServices); // Ensure rows update with fetched services
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    setRows(services); // Keep rows in sync with services
  }, [services]);
  
  const handleAddService = async () => {
    if (newService.name && newService.service && newService.amount && newService.date) {
      try {
        const addedService = await addService({
          name: newService.name,
          date: newService.date,
          amount: Number(newService.amount),
          tip: Number(newService.tip) || 0,
          service: newService.service,
        });
  
        setServices([...services, addedService]); // Update services instead of rows
        setIsOpen(false);
        toast.success("Service has been added to database");
      } catch (error) {
        toast.error("Make sure you have filled all fields");
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const imgUrl = "https://res.cloudinary.com/dap91fhxh/image/upload/v1738954676/logo1_nojit1.png";
    
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      let aspectRatio = img.width / img.height;
      let imgWidth = 40;
      let imgHeight = imgWidth / aspectRatio;
      doc.addImage(imgUrl, "PNG", 150, 5, imgWidth, imgHeight);
      doc.setTextColor("#D4AF37");
      doc.setFontSize(18);
      
      const visibleRows = filteredRows;
      const totalAmount = visibleRows.reduce((sum, row) => sum + row.amount + row.tip, 0);
      const discountAmount = discount ? (totalAmount * Number(discount)) / 100 : 0;
      
      autoTable(doc, {
        head: [["Therapist", "Service Offered", "Date", "Amount (Ksh)", "Tip Left (Ksh)"]],
        body: visibleRows.map(row => [row.name, row.service, row.date, row.amount, row.tip]),
        startY: imgHeight + 20,
        theme: "grid",
        styles: { fontSize: 12 },
        headStyles: { fillColor: "#000000", textColor: "#D4AF37" },
      });
      
      const finalY = (doc as any).lastAutoTable?.finalY || imgHeight + 30;
      doc.setTextColor("#D4AF37");
      doc.setFontSize(14);
      doc.text(`Total Amount: Ksh ${totalAmount}`, 14, finalY + 10);
      if (discount) {
        doc.text(`Payout percentage: ${discount}%`, 14, finalY + 20);
        doc.text(`Final Amount: Ksh ${discountAmount}`, 14, finalY + 30);
      }
      
      doc.save("massage_services.pdf");
    };
  };

  return (
    <div className="bg-white p-6 rounded-md flex-1 m-4 mt-0 shadow relative">
       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h2 className="font-bold mb-4 text-xl">NiccyDjons Services</h2>
      <input type="text" value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Search by Therapist" className="border rounded px-3 py-2 mb-4" />
      <input type="date" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} className="border rounded px-3 py-2 mb-4 mx-2" />
      <input type="date" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} className="border rounded px-3 py-2 mb-4" />
      <input type="number" value={discount} onChange={handleDiscountChange} placeholder="Payout (%)" className="border rounded px-3 py-2 mb-4 ml-2" />
      <DataGrid rows={filteredRows} columns={columns} getRowId={(row) => row._id} checkboxSelection sortingOrder={["asc", "desc"]} />
      <div className="fixed bottom-8 right-8 flex space-x-4">
        <button onClick={() => setIsOpen(true)} className="bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg">+ Add Service</button>
        <button onClick={generatePDF} className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg">Generate PDF</button>
      </div>

      {/* Sliding Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="bg-white p-6 w-1/3 h-full shadow-lg transition-transform transform -translate-x-0">
            <h3 className="text-xl font-semibold mb-4">Add New Service</h3>
            <input type="text" placeholder="Therapist Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="border rounded px-3 py-2 mb-4 w-full" />
            <input type="text" placeholder="Service Offered" value={newService.service} onChange={(e) => setNewService({ ...newService, service: e.target.value })} className="border rounded px-3 py-2 mb-4 w-full" />
            <input type="number" placeholder="Amount (Ksh)" value={newService.amount} onChange={(e) => setNewService({ ...newService, amount: e.target.value })} className="border rounded px-3 py-2 mb-4 w-full" />
            <input type="date" value={newService.date} onChange={(e) => setNewService({ ...newService, date: e.target.value })} className="border rounded px-3 py-2 mb-4 w-full" />
            <input type="number" placeholder="Tip Left (Ksh)" value={newService.tip} onChange={(e) => setNewService({ ...newService, tip: e.target.value })} className="border rounded px-3 py-2 mb-4 w-full" />
            <div className="flex justify-between">
              <button onClick={() => setIsOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded shadow">Cancel</button>
              <button onClick={handleAddService} className="bg-green-500 text-white px-4 py-2 rounded shadow">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MassageServiceListPage;
