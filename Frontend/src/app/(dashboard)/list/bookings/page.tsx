// app/bookings/page.tsx
"use client"

import React, { useEffect, useState } from "react";
import { fetchBookings } from "@/services/api"; // Import the fetchBookings function

interface Booking {
  _id: string;
  name: string;
  date: string;
  service: string;
  email: string;
  phone: string;
}

const BookingsListPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Fetching bookings data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedBookings = await fetchBookings();
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to only run once on mount

  return (
    <div className="p-6 font-sans">
      <h1 className="text-center text-2xl font-bold mb-6">Bookings</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full shadow-lg">
          <thead>
            <tr className="bg-lamaSky text-white">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Service</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={booking._id}
                className={`${index % 2 === 0 ? "" : "bg-lamaSkyLight"}`}
              >
                <td className="px-4 py-2 text-left">{booking.name}</td>
                <td className="px-4 py-2 text-left">{booking.date}</td>
                <td className="px-4 py-2 text-left">{booking.service}</td>
                <td className="px-4 py-2 text-left">{booking.email}</td>
                <td className="px-4 py-2 text-left">{booking.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsListPage;
