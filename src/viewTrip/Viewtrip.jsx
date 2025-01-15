import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConfig";
import InfoSection from "./components/InfoSection.jsx";
import Hotes from "./components/Hotes.jsx";
import PlacesToVisit from "./components/PlacesToVisit.jsx";
import Header from "@/components/ui/custom/Header.jsx";



const ViewTrip = () => {
  const { tripId } = useParams(); // Get tripId from URL
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
      console.log(snapDoc.data())
    }
  };

  return (
    <>
    <Header/>
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      <InfoSection trip={trip}/>
      <Hotes trip={trip}/>
      <PlacesToVisit trip = {trip}/>

      <div>Trip ID: {tripId}</div>
    </div>
    </>
  );
};

export default ViewTrip;
