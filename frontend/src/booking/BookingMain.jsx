import React, { useEffect, useState } from "react";
import HotelBooking from "./HotelBooking";
import FlightBooking from "./FlightBooking";
import SightSeeing from "./SightSeeing";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import FloatingNavBar from "@/components/ui/custom/FloatingNavBar";
import Header from "@/components/ui/custom/Header";

const BookingNavbar = () => {
  const [activeTab, setActiveTab] = useState("");
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null); // State for trip data

  // Fetch the trip data
  useEffect(() => {
    fetchTripData();
  }, [tripId]);

  const fetchTripData = async () => {
    if (!tripId) return;

    const docRef = doc(db, "AITrip", tripId); // Reference to Firestore document
    const snapDoc = await getDoc(docRef); // Fetch the document

    if (snapDoc.exists()) {
      setTrip(snapDoc.data()); // Set fetched data to state
      console.log(snapDoc.data());
    }
  };
  return (
    <div>
      {/* Navigation Bar */}
      <Header/>
      <nav className="flex justify-center bg-gray-100 p-4">
        {["hotels", "flights"].map((tab) => (
          <div
            key={tab}
            className={`mx-4 px-6 py-2 cursor-pointer text-lg font-semibold transition-all ${
              activeTab === tab
                ? "text-blue-600 border-b-4 border-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </nav>


 {  !activeTab  ?  <div className="flex flex-col mt-32 justify-center items-center">
        <img src="/illustration.svg" alt="" />
      <h1 className="font-bold mt-10">Click on any tab to see</h1>
      </div>

:

      <div className="mt-6 text-center">
        {activeTab === "hotels" && <HotelBooking trip={trip} />}
        {activeTab === "flights" && <FlightBooking />}
        {activeTab === "sightseeing" && <SightSeeing />}
      </div>}
      <FloatingNavBar tripId={tripId} />
    </div>
  );
};

// Section Components

export default BookingNavbar;
