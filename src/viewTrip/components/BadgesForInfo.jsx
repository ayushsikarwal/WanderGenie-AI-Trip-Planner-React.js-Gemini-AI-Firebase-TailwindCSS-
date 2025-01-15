import React from "react";
import { Link } from "react-router-dom";
import Badgesub from "./Badgesub.jsx";

const BadgesForInfo = ({ tripDetails }) => {
  if (!tripDetails || !tripDetails.activities) {
    return <p>No trip details or activities available.</p>;
  }

  return (
    <div>
      <div className="flex justify-between">
        <p className="font-semibold">
          Theme:{" "}
          <span className="text-gray-500 text-sm">{tripDetails?.theme || "N/A"}</span>
        </p>
        <p className="font-semibold">
          Best Time to Visit:{" "}
          <span className="text-gray-500 text-sm">
            {tripDetails?.bestTimeToVisit || "N/A"}
          </span>
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5 sm:grid-cols-1">
        {tripDetails.activities.map((activity, index) => (
          <div
            key={index}
            className="m-2 border-2 border-gray-300 rounded-xl hover:scale-105 transition-all max-w-xs sm:max-w-sm"
          >
            <Badgesub it={activity} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesForInfo;
