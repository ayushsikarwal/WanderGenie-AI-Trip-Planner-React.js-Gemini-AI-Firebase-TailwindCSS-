import React, { useEffect, useState } from "react";
import { Button } from "/src/components/ui/button.jsx";
import { GetPlaceDetails, Photo_Req } from "@/services/GlobalAPI";
import { useNavigate } from "react-router-dom";

const InfoSection = ({ trip, tripId }) => {

  const [photo, setPhoto] = useState()

  const navigate = useNavigate()
  useEffect(() => {
      trip&&GetPlacePhoto();
  }, [trip]);

  const GetPlacePhoto = async () => {
    try {
      const query = trip?.tripChoices?.location?.label;
      if (!query) {
        console.warn("No location label provided.");
        return;
      }

      // console.log("Fetching place details for:", query);
      const placeDetails = await GetPlaceDetails({
        'textQuery':query
      });
      
      // console.log(placeDetails.data.places[0].photos[4].name)
      // console.log(placeDetails.data.places[0].photos[4].heightPx)
      // console.log(placeDetails.data.places[0].photos[4].widthPx)

      setPhoto(Photo_Req(placeDetails.data.places[0].photos[4].name, placeDetails.data.places[0].photos[4].heightPx, placeDetails.data.places[0].photos[4].widthPx))

      
    } catch (error) {
      console.error("Failed to fetch place details:", error.response?.data || error.message);
    }
  };


  return (
    <div className="flex flex-col">
      <img className="h-[400px] w-full object-cover rounded" src={photo|| '/placeholder.png'} alt="" />
      <h1 className="my-5 font-extrabold text-[20px]">{trip?.tripChoices?.location?.label}</h1>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <h2 className="p-1 px-3 bg-gray-300 rounded text-gray-700 text-ex md:text-md">
            📅 {trip?.tripChoices?.noOfDays} Days
          </h2>
          <h2 className="p-1 px-3 bg-gray-300 rounded text-gray-700 text-ex md:text-md">
            🎊 {trip?.tripChoices?.typeOftrip}
          </h2>
          <h2 className="p-1 px-3 bg-gray-300 rounded text-gray-700 text-ex md:text-md">
            💰 {trip?.tripChoices?.budget}
          </h2>
        </div>
        {/* <div>
          <Button onClick ={()=>{navigate(`/chat-room/${tripId}`)}} className="rounded"> 🛫 Chatting Area</Button>
          <Button onClick ={()=>{navigate(`/budgeting-tool/${tripId}`)}} className="rounded"> 🛫 Budget Tracking trip</Button>
        </div> */}
      </div>
    </div>
  );
};

export default InfoSection;
