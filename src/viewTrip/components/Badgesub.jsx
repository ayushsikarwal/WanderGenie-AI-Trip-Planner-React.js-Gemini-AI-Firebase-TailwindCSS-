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
  } = it;

      const [photo, setPhoto] = useState()
    
      useEffect(() => {
        it&&GetPlacePhoto();
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
            'textQuery':query
          });
    
          // console.log(Photo_Req(placeDetails.data.places[0].photos[4].name, placeDetails.data.places[0].photos[4].heightPx, placeDetails.data.places[0].photos[4].widthPx))
          // console.log(placeDetails.data)
          // setPhoto(Photo_Req(placeDetails.data.places[0].photos[4].name, placeDetails.data.places[0].photos[4].heightPx, placeDetails.data.places[0].photos[4].widthPx))
    
          setPhoto(Photo_Req(placeDetails.data.places[0].photos[4].name, placeDetails.data.places[0].photos[4].heightPx, placeDetails.data.places[0].photos[4].widthPx))
        } catch (error) {
          console.error("Failed to fetch place details:", error.response?.data || error.message);
        }
      };

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${placeName}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="m-2 flex">
        <img
          className="w-[130px] h-[130px] rounded-xl m-3 object-cover"
          src={photo|| '/placeholder.png'}
          alt={`${placeName}`}
        />
        <div className="my-3">
          <h2 className="text-sm font-bold">Place Name: {placeName}</h2>
          <h2 className="text-xs">💰 {ticketPricing}</h2>
          <p className="text-xs">⏱️ {timeTravel}</p>
          <p className="text-xs">⭐ {rating}</p>
        </div>
      </div>
      <div>
        <p className="mx-5 text-xs text-gray-500">🤷‍♂️ {placeDetails}</p>
      </div>
    </Link>
  );
};

export default Badgesub;
