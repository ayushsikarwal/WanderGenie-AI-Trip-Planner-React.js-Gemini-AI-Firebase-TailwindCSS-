import { GetPlaceDetails, Photo_Req } from "@/services/GlobalAPI";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Hotelbadges = ({ hotel }) => {
    const [photo, setPhoto] = useState()
  
    useEffect(() => {
      hotel&&GetPlacePhoto();
    }, [hotel]);
  
    const GetPlacePhoto = async () => {
      try {
        const query = hotel.hotelName;
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
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        hotel.hotelName +
        "," +
        hotel.hotelAddress
      }
      target="-blank"
    >
      <img className="w-full h-[180px] object-cover rounded-xl" src={photo|| '/placeholder.png'} />
      <div className="my-2">
        <h2 className="font-medium">{hotel.hotelName}</h2>
        <h2 className="text-xs text-gray-500">{hotel.hotelAddress}</h2>
        <h2 className="text-sm">💰 {hotel.price}</h2>
        <h2 className="text-sm">⭐ {hotel.rating}</h2>
      </div>
    </Link>
  );
};

export default Hotelbadges;
