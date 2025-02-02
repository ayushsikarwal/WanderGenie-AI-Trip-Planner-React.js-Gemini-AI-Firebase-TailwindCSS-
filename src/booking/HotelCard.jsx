import axios from "axios";
import { Outdent } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const HotelCard = ({ hotel, trip }) => {
//   const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [photo, setPhoto] =useState([])
  const [price, setPrice] =useState("")
  const [curr, setCurr] =useState("")
//   const [tax, setTax] =useState(0)

  const nextImage = () => {
    if (!photo || photo.length === 0) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.Images.length);
  };

  useEffect(()=>{
    const fetchData = async()=>{
        const images = await axios.post("http://localhost:5001/api/hotel-detail",
            {
                "code" : hotel.HotelCode
            }
        )
        setPhoto(images.data.HotelDetails[0].Images)
        setPrice("📱 Contact: "+images.data.HotelDetails[0].PhoneNumber)
    }
    const fetchPriceData = async()=>{
        const inputDate = trip.tripChoices.inDate
        const outputDate = trip.tripChoices.outDate

        const [inDate, inMonth, inYear] = inputDate.split("-")
        const [outDate, outMonth, outYear] = outputDate.split("-")

        const formattedInDate = `${inYear}-${inMonth}-${inDate}`;
        const formattedOutDate = `${outYear}-${outMonth}-${outDate}`;

        console.log(formattedInDate+"-->"+formattedOutDate)

        const hotelres = await axios.post("http://localhost:5001/api/price-detail",
            {
                "inDate": formattedInDate,
                "outDate": formattedOutDate,
                "code": hotel.HotelCode
            }
        )
        hotelres.data.code ? "" : setPrice(hotelres.data.HotelResult[0].Currency+" "+hotelres.data.HotelResult[0].Rooms[0].DayRates[0][0].BasePrice)
        // setPrice(hotelres.data.HotelResult[0].Rooms[0].DayRates[0][0].BasePrice)
    }
    fetchData()
    fetchPriceData()
  },[hotel])
  const prevImage = () => {
    // if (!photo || photo.length === 0) return; // Prevent errors when photo is undefined or empty
    if (!photo || photo.length === 0) return;
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + photo.length) % photo.length
    );
  };
  

  const handleViewDetails = (e) => {
    e.preventDefault();
    window.open(`/booking/hotels/${hotel.HotelCode}`, "_blank");
  };  

  return (
    <div className="flex w-[1100px] items-center border border-gray-300 rounded-3xl my-5 p-5 gap-6 shadow-md">
      {/* Image Slider */}
      <div className="relative w-[500px] h-[300px] flex items-center justify-center">
        <button
          onClick={prevImage}
          className="absolute left-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
        >
          ◀
        </button>
        <img
          src={
            photo && photo.length > 0
              ? photo[currentImageIndex]
              : "/placeholder.png"
          }
          alt="Hotel"
          className="w-full h-full object-cover rounded-3xl"
        />
        <button
          onClick={nextImage}
          className="absolute right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
        >
          ▶
        </button>
      </div>

      {/* Hotel Info */}
      <div className="flex-1 text-left space-y-3">
        <h2 className="text-2xl font-bold">{hotel.HotelName}</h2>
        <p className="text-gray-600 text-sm">{hotel.Address}</p>
        <p className="text-yellow-500 font-semibold">⭐ {hotel.TripAdvisorRating}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {hotel.HotelFacilities && Array.isArray(hotel.HotelFacilities) ? (
            hotel.HotelFacilities.slice(0, 4).map((amenity, index) => (
              <span
                key={index}
                className="bg-gray-200 px-2 py-1 rounded-md text-sm"
              >
                {amenity}
              </span>
            ))
          ) : (
            <span>No amenities available</span>
          )}

          {hotel.HotelFacilities &&
            Array.isArray(hotel.HotelFacilities) &&
            hotel.HotelFacilities.length > 4 && (
              <span className="text-blue-500 ">
                +{hotel.HotelFacilities.length - 4} more
              </span>
            )}
        </div>

        {/* Price Section */}
        <div className="flex items-center space-x-2">
          <span className="text-md font-normal text-gray-900">{price}</span> {/*phone no is fetching not the price*/}
          {/* <span className="text-gray-500 line-through">₹{hotel.Price}</span> */}
          <span className="text-orange-500 font-semibold">
            {hotel.Discount}
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          {hotel.Tax} taxes & fees · per room per night
        </p>

        {/* Buttons */}
        <div className="flex mr-8 space-x-4 mt-3">
          <button
            className="px-4 py-2 border border-black rounded-lg text-black hover:bg-gray-100 transition"
            onClick={handleViewDetails}
          >
            View Details
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
