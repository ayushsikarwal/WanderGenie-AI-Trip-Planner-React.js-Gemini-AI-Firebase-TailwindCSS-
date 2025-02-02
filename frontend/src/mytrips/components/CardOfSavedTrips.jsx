import { GetPlaceDetails, Photo_Req } from "@/services/GlobalAPI";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CardOfSavedTrips = ({ trip }) => {
    const [photo, setPhoto] = useState();
  
    useEffect(() => {
      trip && GetPlacePhoto();
    }, [trip]);
  
    const GetPlacePhoto = async () => {
      try {
        const query = trip?.tripChoices?.location?.label;
        if (!query) {
          console.warn("No location label provided.");
          return;
        }
  
        const placeDetails = await GetPlaceDetails({
          textQuery: query,
        });
  
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
      <Link to={'/view-trip/' + trip.id}>
        <div className="group p-3 sm:p-5 transition-all duration-300 hover:scale-105">
          <div className="relative w-full aspect-square overflow-hidden rounded-2xl sm:rounded-3xl shadow-md">
            <img
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
              src={photo}
              alt={trip?.tripChoices?.location?.label || "Trip destination"}
              loading="lazy"
            />
          </div>
          <div className="mt-3 sm:mt-4">
            <h2 className="font-bold text-base sm:text-lg truncate">
              {trip?.tripChoices?.location?.label}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {trip.tripChoices.noOfDays} days trip with {trip.tripChoices.budget} budget
            </p>
          </div>
        </div>
      </Link>
    );
  };

export default CardOfSavedTrips;
