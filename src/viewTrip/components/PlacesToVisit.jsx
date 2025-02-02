import React from "react";
import BadgesForInfo from "./BadgesForInfo";

const PlacesToVisit = ({ trip }) => {
  // Extract the itinerary from the trip data
  const itinerary = trip?.tripData?.itinerary;

  // Check if the itinerary exists and is an object
  if (!itinerary || typeof itinerary !== "object") {
    return <div>Loading or No Places Available</div>; // Handle missing or invalid itinerary
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
    <h2 className="font-bold text-2xl text-gray-800 border-b-2 border-gray-300 pb-2">
      🏞️ Places to Visit
    </h2>
  
    <div className="mt-4 space-y-6">
      {Object.entries(itinerary)
        .sort(([dayA], [dayB]) => dayA.localeCompare(dayB)) // Sort days alphabetically
        .map(([day, details]) => (
          <div key={day} className="bg-white p-4 shadow-md rounded-lg">
            <h3 className="font-extrabold text-xl text-red-500 mb-2">
              📅 {day.toUpperCase()}
            </h3>
            <BadgesForInfo tripDetails={details} />
          </div>
        ))}
    </div>
  </div>
  
  );
};

export default PlacesToVisit;
