// app/members/page.tsx
"use client"
import React, { useEffect, useState } from "react";
import { fetchMembers } from "@/services/api";
import Image from "next/image";

interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  startDate: string;
  isActive: boolean;
}

const MembersListPage = () => {
  const [members, setMembers] = useState<Member[]>([]);

  // Fetch members data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMembers = await fetchMembers();
        setMembers(fetchedMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="p-6 font-sans">
      <h1 className="text-center text-2xl font-bold mb-6">Members</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full shadow-lg">
          <thead>
            <tr className="bg-lamaSky text-white">
              <th className="px-4 py-2 text-center">Name</th>
              <th className="px-4 py-2 text-center">Email</th>
              <th className="px-4 py-2 text-center">Phone</th>
              <th className="px-4 py-2 text-center">Start Date</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((user, index) => (
              <tr
                key={user._id}
                className={`${index % 2 === 0 ? "" : "bg-lamaSkyLight"}`}
              >
                <td className="px-4 py-2 text-center">{user.name}</td>
                <td className="px-4 py-2 text-center">{user.email}</td>
                <td className="px-4 py-2 text-center">{user.phone}</td>
                <td className="px-4 py-2 text-center">{user.startDate}</td>
                <td
                  className={`px-4 py-2 font-bold text-center ${user.isActive ? "text-lamaPurple" : "text-red-600"}`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-2 text-center">
                  <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                    <Image src="/view.png" alt="View" width={16} height={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersListPage;
