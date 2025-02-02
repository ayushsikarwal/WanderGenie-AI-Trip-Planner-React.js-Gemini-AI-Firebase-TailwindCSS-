import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard.jsx";
import axios from "axios";

const HotelBooking = ({ trip }) => {
  const [info, setInfo] = useState([]);
  const location = trip?.tripChoices?.location?.label;
  console.log(trip);
console.log(trip?.tripChoices);
console.log(trip?.tripChoices?.location);

  console.log(location)
  const city = location.split(",")[0];
  const state = location.split(",")[1];
  const country = location.split(",")[2];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCountryCode = await axios.get(`http://localhost:5001/api/country-list/${country}`);
        const getCityCode = await axios.post(`http://localhost:5001/api/city-list`, {
          "code": getCountryCode.data.code,
          "cityName": city
        });
        const hotel = await axios.post(`http://localhost:5001/api/hotels`, {
          "code": getCityCode.data.city
        });
  
        console.log(hotel.data);
        setInfo(hotel.data.Hotel);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [trip]);  // dependencies array: ensure the effect runs when `trip`, `country`, or `city` changes.
  

  const Hotels = [
    {
      HotelCode: "1001430",
      HotelName: "City View Resort",
      HotelRating: 4.2,
      Address: "Beach Road, Goa",
      DiscountedPrice: 3200,
      Price: 6400,
      Discount: "50% off",
      Amenities: [
        "Pool",
        "Beachfront",
        "Restaurant",
        "Free Wifi",
        "Fitness Center",
      ],
      Images: [
        "https://api.tbotechnology.in/imageresource.aspx?img=9eMP+0FIICgCIk6ZClzZH9Cs+1gwAq6BFWcc22yNLMF/UJIXMdxPdc/YiM5ymb8RsovYvrG54FHXk38JWF6WAl1hFjKYwQ65T1zHxYnlAWg=",
        "https://api.tbotechnology.in/imageresource.aspx?img=9eMP+0FIICgCIk6ZClzZH9Cs+1gwAq6BFWcc22yNLMF/UJIXMdxPdc/YiM5ymb8RsovYvrG54FGrpzma5JXVS/sKuY7sW9szKAX5Q+8I2Ow=",
      ],
      Tax: "₹400",
    },
    {
      HotelCode: "1001445",
      HotelName: "Mountain Retreat",
      HotelRating: 4.7,
      Address: "Hilltop, Shimla",
      DiscountedPrice: 4000,
      Price: 8000,
      Discount: "50% off",
      Amenities: [
        "Hiking Trails",
        "Free Wifi",
        "Restaurant",
        "Mountain View",
        "Spa",
      ],
      Images: [
        "https://api.tbotechnology.in/imageresource.aspx?img=9eMP+0FIICgCIk6ZClzZH9Cs+1gwAq6BFWcc22yNLMF/UJIXMdxPdc/YiM5ymb8RsovYvrG54FEEUDEepHeUfQgia3CaCn6fRrfVQ7hkBVo=",
        "https://api.tbotechnology.in/imageresource.aspx?img=9eMP+0FIICgCIk6ZClzZH9Cs+1gwAq6BFWcc22yNLMF/UJIXMdxPdc/YiM5ymb8RsovYvrG54FHltNgycOIFnN/qLAFy9u+9XuXl/awff4Q=",
      ],
      Tax: "₹500",
    },
    {
      HotelCode: "1001450",
      HotelName: "Ocean Breeze Resort",
      HotelRating: 4.9,
      Address: "Coconut Beach, Kerala",
      DiscountedPrice: 3500,
      Price: 7000,
      Discount: "50% off",
      Amenities: [
        "Private Beach",
        "Restaurant",
        "Free Wifi",
        "Outdoor Pool",
        "Spa",
      ],
      Images: [
        "https://api.tbotechnology.in/imageresource.aspx?img=9eMP+0FIICgCIk6ZClzZH9Cs+1gwAq6BFWcc22yNLMF/UJIXMdxPdc/YiM5ymb8RsovYvrG54FG+8MAKVj5nquFkd1d3umZG3i3X03ifGrI=",
      ],
      Tax: "₹350",
    },
    {
      HotelCode: "1001460",
      HotelName: "Lakeview Inn",
      HotelRating: 4.3,
      Address: "Lake Road, Udaipur",
      DiscountedPrice: 2800,
      Price: 5600,
      Discount: "50% off",
      Amenities: ["Lake View", "Restaurant", "Free Wifi", "Bar", "Boating"],
      Images: [
        "https://api.tbotechnology.in/imageresource.aspx?img=9eMP+0FIICgCIk6ZClzZH9Cs+1gwAq6BFWcc22yNLMF/UJIXMdxPdc/YiM5ymb8RsovYvrG54FHXk38JWF6WAl1hFjKYwQ65T1zHxYnlAWg=",
      ],
      Tax: "₹450",
    },
    {
      HotelCode: "1001470",
      HotelName: "Skyline Grand",
      HotelRating: 4.6,
      Address: "Downtown, Mumbai",
      DiscountedPrice: 4200,
      Price: 8400,
      Discount: "50% off",
      Amenities: ["City View", "Rooftop Bar", "Restaurant", "Gym", "Spa"],
      Images: [
        "https://api.tbotechnology.in/imageresource.aspx?img=9eMP+0FIICgCIk6ZClzZH9Cs+1gwAq6BFWcc22yNLMF/UJIXMdxPdc/YiM5ymb8RsovYvrG54FEEUDEepHeUfQgia3CaCn6fRrfVQ7hkBVo=",
      ],
      Tax: "₹600",
    },
  ];
  return (
    <div className="p-6 text-xl mx-auto font-semibold rounded-lg">
      Hotel Booking Section for <span>{location}</span>
      <div className="my-0 mx-auto">
        <div className="mt-8 flex flex-col justify-center items-center">
          {info.map((hotel) => (
            <HotelCard key={hotel.HotelCode} hotel={hotel} trip={trip}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;
