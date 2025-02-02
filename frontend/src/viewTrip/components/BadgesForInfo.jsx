import React from "react";
import { Link } from "react-router-dom";
import Badgesub from "./Badgesub.jsx";

const BadgesForInfo = ({ tripDetails }) => {
  if (!tripDetails || !tripDetails.activities) {
    return <p>No trip details or activities available.</p>;
  }

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg">
  {/* Info Row */}
  <div className="flex flex-col md:flex-row md:justify-between gap-4 border-b border-gray-300 pb-3">
    <p className="font-bold text-lg text-gray-800">
      📌 Date to Visit:{" "}
      <span className="text-gray-500 text-sm">{tripDetails?.date || "N/A"}</span>
    </p>
    <p className="font-semibold text-gray-700">
      🎭 Theme:{" "}
      <span className="text-gray-500 text-sm">{tripDetails?.theme || "N/A"}</span>
    </p>
    <p className="font-semibold text-gray-700">
      🌅 Best Time to Visit:{" "}
      <span className="text-gray-500 text-sm">{tripDetails?.bestTimeToVisit || "N/A"}</span>
    </p>
  </div>

  {/* Activities Grid */}
  <div className="w-full grid grid-cols-1 gap-5 mt-4">
    {tripDetails.activities.map((activity, index) => (
      <div
        key={index}
        className="border border-gray-300 rounded-xl hover:scale-105 transition-all w-full bg-white shadow-md p-4"
      >
        <Badgesub it={activity} />
      </div>
    ))}
  </div>
</div>

  );
};

export default BadgesForInfo;
