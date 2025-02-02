import Header from "@/components/ui/custom/Header";
import { db } from "@/services/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import CardOfSavedTrips from "./components/CardOfSavedTrips";

const Mytrips = () => {
    const [user,setuser]= useState('')
    const [userTrip, setUserTrip] = useState([]);

    useEffect(()=>{
      let userInstorage = JSON.parse(localStorage.getItem("user"));
      setuser(userInstorage)
    },[])
    useEffect(() => {
      if (user) {
        getUserInfo();
      }
    }, [user]);
  
    const getUserInfo = async () => {
      const q = query(
        collection(db, "AITrip"),
        where("user.email", "==", user.email)
      );
  
      const querySnapshot = await getDocs(q);
      const trips = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
  
      setUserTrip(trips);
    };
  
    return (
      <div>
        <Header />
        <div className="px-4 sm:px-6 md:px-12 lg:px-44 py-8 sm:py-12 md:py-20">
          <h2 className="font-extrabold text-2xl sm:text-[30px] mb-6">My trips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {userTrip && userTrip.length>0 &&  userTrip.map((trip) => (
              <CardOfSavedTrips key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </div>
    );
  };

export default Mytrips;
