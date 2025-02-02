import { GetPlaceDetails, Photo_Req } from '@/services/GlobalAPI';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hotelbadges from './Hotelbadges.jsx';

const Hotels = ({ trip }) => {
  // Check if trip and tripData are valid
  if (!trip || !trip.tripData || !trip.tripData.hotelOptions) {
    return <div>Loading or No Hotels Available</div>;  // Handle the case where data is not available
  }



  return (
    <div>
      <h2 className='font-bold text-xl mt-5 mb-3'>Hotel Recommendation</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
        {trip.tripData.hotelOptions.map((hotel, index) => {
          return (
            <div className='hover:scale-110 transition-all' key={index}>
              {/* Wrap everything inside the Link to make it clickable */}
              <Hotelbadges hotel={hotel}/>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hotels;
