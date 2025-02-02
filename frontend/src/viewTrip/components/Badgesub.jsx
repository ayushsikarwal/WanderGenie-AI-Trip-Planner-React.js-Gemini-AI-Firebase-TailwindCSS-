import { Button } from "@/components/ui/button";
import { GetPlaceDetails, Photo_Req } from "@/services/GlobalAPI";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Badgesub = ({ it }) => {
  if (!it) return <div>No details available.</div>;

  const {
    placeName = "Unknown Place",
    ticketPricing = "N/A",
    timeTravel = "N/A",
    rating = "N/A",
    placeDetails = "No details provided.",
    optimalVisitTime = "N/A",
    publicTransport = "N/A",
    nearbyShops = "N/A",
    nearbyFoodStalls = "N/A",
  } = it;

  const [photo, setPhoto] = useState();

  useEffect(() => {
    it && GetPlacePhoto();
  }, [it]);

  const GetPlacePhoto = async () => {
    try {
      const query = placeName;
      if (!query) {
        console.warn("No location label provided.");
        return;
      }

      console.log("Fetching hotel details for:", query);
      const placeDetails = await GetPlaceDetails({
        textQuery: query,
      });

      // console.log(Photo_Req(placeDetails.data.places[0].photos[4].name, placeDetails.data.places[0].photos[4].heightPx, placeDetails.data.places[0].photos[4].widthPx))
      // console.log(placeDetails.data)
      // setPhoto(Photo_Req(placeDetails.data.places[0].photos[4].name, placeDetails.data.places[0].photos[4].heightPx, placeDetails.data.places[0].photos[4].widthPx))

      setPhoto(
        Photo_Req(
          placeDetails.data.places[0].photos[4].name,
          placeDetails.data.places[0].photos[4].heightPx,
          placeDetails.data.places[0].photos[4].widthPx
        )
      );
    } catch (error) {
      console.error(
        "Failed to fetch place details:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${placeName}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block transform transition-transform hover:scale-100"
    >
      <div className="m-2 flex bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all">
        {/* Image Section */}
        <img
          className="w-[140px] h-[140px] rounded-xl m-3 object-cover shadow-sm"
          src={photo || "/placeholder.png"}
          alt={`${placeName}`}
        />

        {/* Text Content */}
        <div className="my-3 flex flex-col justify-between pr-4">
          <h2 className="flex justify-between text-lg font-semibold text-gray-800">
            📍 {placeName}
            <Button className="rounded-full h-2 hover:text-white bg-red-300 text-black border-l-red-600 font-extrabold">See location on map</Button>
          </h2>
          <p className="text-xs text-gray-600 flex items-center">
            💰 <span className="ml-1">{ticketPricing}</span>
          </p>
          <p className="text-xs text-gray-600 flex items-center">
            ⏱️ <span className="ml-1">{timeTravel}</span>
          </p>
          <p className="text-sm font-bold text-green-700">
            👌 {optimalVisitTime}
          </p>

          {/* Nearby Information */}
          <div className="mt-2 space-y-1 text-xs text-gray-700">
            {publicTransport.length > 0 && (
              <p>
                🚌{" "}
                <span className="ml-1">{publicTransport}</span>
              </p>
            )}
            {nearbyShops.length > 0 && (
              <p>
                🛍️ <span className="ml-1">{nearbyShops}</span>
              </p>
            )}
            {nearbyFoodStalls.length > 0 && (
              <p>
                😋 <span className="ml-1">{nearbyFoodStalls}</span>
              </p>
            )}
          </div>

          {/* Rating */}
          <p className="text-sm text-yellow-500 font-medium mt-2">
            ⭐ {rating}
          </p>
          
        </div>
      </div>

      {/* Place Details */}
      <div className="bg-gray-50 p-3 mx-5 rounded-lg text-xs text-gray-600 shadow-sm mt-1">
        🤷‍♂️ {placeDetails}
      </div>
    </Link>
  );
};

export default Badgesub;
