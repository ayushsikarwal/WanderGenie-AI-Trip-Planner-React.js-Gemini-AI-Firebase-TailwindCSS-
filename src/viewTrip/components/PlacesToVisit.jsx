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
    <div>
      <h2 className="font-bold text-lg">Places to Visit</h2>

      <div>
        {Object.entries(itinerary)
          .sort(([dayA], [dayB]) => dayA.localeCompare(dayB)) // Sort keys in ascending order
          .map(([day, details]) => (
            <div key={day}>
              <h2 className="font-medium text-lg"> {day.toUpperCase()}</h2>
              <BadgesForInfo tripDetails = {details}/>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlacesToVisit;
