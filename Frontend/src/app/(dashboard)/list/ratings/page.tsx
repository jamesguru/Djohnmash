// app/ratings/page.tsx

import React from "react";
import { fetchRatings } from "@/services/api"; // Import the fetchRatings function

interface Rating {
  _id: string;
  user: string;
  rating: string;
  comment: string;
  date: string;
}

const RatingsListPage = async () => {
  // Fetch ratings data from the API
  const ratings: Rating[] = await fetchRatings();


  const handleRatings = (rating: string) => {

    if(rating === "5"){
      return "Excellent"
    }else if(rating === "4"){
      return "Good"
    }else if(rating === "3"){
      return "Average"
    }else{
      return "Poor"
    }

  }

  return (
    <div className="p-6 font-sans">
      <h1 className="text-center text-2xl font-bold mb-6">Ratings</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full shadow-lg">
          <thead>
            <tr className="bg-lamaSky text-white">
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Comment</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((rating, index) => (
              <tr
                key={rating._id}
                className={`${index % 2 === 0 ? "" : "bg-lamaSkyLight"}`}
              >
                <td className="px-4 py-2 text-left">{rating.user}</td>
                <td className="px-4 py-2 text-left">{handleRatings(rating.rating)}</td>
                <td className="px-4 py-2 text-left">{rating.comment}</td>
                <td className="px-4 py-2 text-left">{rating.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RatingsListPage;
