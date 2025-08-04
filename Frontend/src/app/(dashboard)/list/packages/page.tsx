"use client";

import { useState } from "react";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import { role } from "@/lib/data";

// Initial Data
const initialAttendance = [
  {
    id: 1,
    name: "John Doe",
    department: "Massage Therapy",
    checkIn: "2025-08-04T08:30:00Z",
    checkOut: "2025-08-04T16:00:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    department: "Spa",
    checkIn: null,
    checkOut: null,
  },
];

const toEAT = (utcString: string | null) => {
  if (!utcString) return "-";
  const date = new Date(utcString);
  return new Intl.DateTimeFormat("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Nairobi",
  }).format(date);
};

const StatusBadge = ({ checkedIn, checkedOut }: { checkedIn: boolean; checkedOut: boolean }) => {
  if (!checkedIn) {
    return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">Pending</span>;
  }
  if (checkedIn && !checkedOut) {
    return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">Working</span>;
  }
  return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">Completed</span>;
};

const AttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState(initialAttendance);

  const handleCheckIn = (id: number) => {
    
  
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance Records</h1>
          <p className="text-gray-500 text-sm">Track employee attendance and working hours</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex gap-2">
            <button className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <Image src="/filter.png" alt="Filter" width={18} height={18} />
            </button>
            <button className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <Image src="/sort.png" alt="Sort" width={18} height={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="space-y-4">
        {attendanceData.map((item) => {
          const hasCheckedIn = !!item.checkIn;
          const hasCheckedOut = !!item.checkOut;

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Employee Info */}
              <div className="flex flex-col flex-1">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.department}</p>
              </div>

              {/* Time Info */}
              <div className="grid grid-cols-2 gap-4 w-full sm:w-auto sm:flex sm:gap-8">
                <div>
                  <p className="text-xs text-gray-500">Check In</p>
                  <p className="font-medium">{toEAT(item.checkIn)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Check Out</p>
                  <p className="font-medium">{toEAT(item.checkOut)}</p>
                </div>
                <div className="col-span-2 sm:col-auto">
                  <p className="text-xs text-gray-500">Status</p>
                  <StatusBadge checkedIn={hasCheckedIn} checkedOut={hasCheckedOut} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {!hasCheckedIn && (
                  <button
                    className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                    onClick={() => handleCheckIn(item.id)}
                  >
                    Check In
                  </button>
                )}
                {hasCheckedIn && !hasCheckedOut && (
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
                  
                  >
                    Check Out
                  </button>
                )}
                {role === "admin" && (
                  <Link href={`/attendance/${item.id}`}>
                    <button className="p-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors">
                      <Image src="/view.png" alt="View" width={18} height={18} />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination />
      </div>
    </div>
  );
};

export default AttendancePage;
