import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import axios from "axios";



const AttractionItem = ({ name, distance }) => (
    <div className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-all duration-300 shadow-sm">
      <div className="flex-shrink-0 mr-4">
        <Navigation className="w-5 h-5 text-orange-500" />
      </div>
      <div className="flex-grow">
        <p className="text-gray-800 font-medium">{name}</p>
        <p className="text-sm text-orange-600">{distance}</p>
      </div>
    </div>
  );
  
  const parseAttractions = (attractionsHtml) => {
    if (!attractionsHtml) return { attractions: [], airports: [] };
    
    // Extract the content between <p> tags
    const matches = attractionsHtml.match(/<p>(.*?)<\/p>/g);
    if (!matches) return { attractions: [], airports: [] };
  
    const attractionsText = matches[0].replace(/<\/?p>/g, '');
    const airportsText = matches[1]?.replace(/<\/?p>/g, '');
  
    // Parse attractions
    const attractions = attractionsText
      .split('<br />')
      .filter(item => item.trim())
      .map(item => {
        const [name, distance] = item.split(' - ').map(s => s.trim());
        return { name, distance };
      });
  
    // Parse airports
    const airports = airportsText
      ?.split('<br />')
      .filter(item => item.trim())
      .map(item => {
        const [name, distance] = item.split(' - ').map(s => s.trim());
        return { name, distance };
      }) || [];
  
    return { attractions, airports };
  };

const ViewDetailOfHotel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  //   const hotel = hotelData.HotelDetails[0];
  const [hotel, setHotel] = useState(null);
  const { hotelId } = useParams();

  useEffect(() => {
    console.log("Hotel ID from URL:", hotelId); // Debugging
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5001/api/hotel-detail",
          { code: hotelId }
        );
        console.log("API Response:", response.data); // Debugging

        if (response.data?.HotelDetails?.length > 0) {
          setHotel(response.data.HotelDetails[0]);
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };
    fetchData();
  }, [hotelId]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotel.Images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + hotel.Images.length) % hotel.Images.length
    );
  };

  // Function to create rating stars
  const renderStars = (rating) => {
    return [...Array(rating)].map((_, index) => (
      <Star key={index} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
    ));
  };

  // Function to parse the description HTML
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  if (!hotel) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-orange-50">
      {/* Hotel Name and Rating Section */}
      <div className="mb-8 bg-white rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{hotel.HotelName}</h1>
            <div className="flex items-center text-gray-600 bg-orange-100 rounded-lg p-2">
              <MapPin className="w-5 h-5 mr-2 text-orange-600" />
              <span className="text-sm">{hotel.Address}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex">{renderStars(hotel.HotelRating)}</div>
              <span className="text-orange-700 font-semibold">{hotel.HotelRating} Star Hotel</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative h-[32rem] mb-8 rounded-xl overflow-hidden shadow-xl">
        <img
          src={hotel.Images[currentImageIndex]}
          alt={`${hotel.HotelName} view ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-orange-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-orange-600" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-orange-100 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-orange-600" />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 px-6 py-2 rounded-full shadow-lg">
          <span className="text-orange-600 font-medium">{currentImageIndex + 1}</span>
          <span className="text-gray-600"> / {hotel.Images.length}</span>
        </div>
      </div>

      {/* Hotel Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Key Information */}
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-orange-700 border-b border-orange-200 pb-2">Key Information</h2>
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                <div></div>
                <Clock className="w-6 h-6 mr-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Check In: <span className="text-orange-700">{hotel.CheckInTime}</span></p>
                  <p className="text-sm font-medium text-gray-900">Check Out: <span className="text-orange-700">{hotel.CheckOutTime}</span></p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                <Phone className="w-6 h-6 mr-4 text-orange-600" />
                <p className="text-sm font-medium text-gray-900">{hotel.PhoneNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="md:col-span-2 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-orange-700 border-b border-orange-200 pb-2">About the Hotel</h2>
            <div className="prose prose-sm max-w-none prose-headings:text-orange-700 prose-strong:text-orange-600" dangerouslySetInnerHTML={createMarkup(hotel.Description)} />
          </CardContent>
        </Card>
      </div>

      {/* Facilities */}
      <Card className="mb-8 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-orange-700 border-b border-orange-200 pb-2">Amenities & Facilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hotel.HotelFacilities.map((facility, index) => (
              <div key={index} className="flex items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                <span className="text-sm text-gray-700">{facility}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nearby Attractions */}
      <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-orange-700 border-b border-orange-200 pb-2">Nearby Attractions</h2>
          {hotel?.Attractions && hotel.Attractions["1) "] ? (
            <div className="prose prose-sm max-w-none prose-headings:text-orange-700 prose-p:text-gray-600" dangerouslySetInnerHTML={{ __html: hotel.Attractions["1) "] }} />
          ) : (
            <p className="text-gray-600">No Attractions present in DB</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewDetailOfHotel;
