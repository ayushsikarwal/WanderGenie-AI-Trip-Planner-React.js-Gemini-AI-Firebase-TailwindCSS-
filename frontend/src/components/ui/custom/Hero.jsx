import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../button.jsx';

function Hero() {
  return (
    <div className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-52 py-8 md:py-12 max-w-screen-2xl mx-auto">
      <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[38px] text-center mt-8 md:mt-16 leading-tight">
        <span className="text-[#f56551] block mb-2">Discover Your Next Adventure With AI:</span>
        Personalized Itineraries at your Fingertips
      </h1>
      
      <p className="text-sm sm:text-base md:text-[15px] text-[#808080] text-center max-w-2xl mt-4 md:mt-6 lg:mt-8">
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget
      </p>
      
      <Link to="/create-trip" className="mt-6 md:mt-8 lg:mt-9">
        <Button className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg font-medium">
          Get started, It's free
        </Button>
      </Link>
      <img src="/main.png" alt="" />
    </div>
  );
}

export default Hero;