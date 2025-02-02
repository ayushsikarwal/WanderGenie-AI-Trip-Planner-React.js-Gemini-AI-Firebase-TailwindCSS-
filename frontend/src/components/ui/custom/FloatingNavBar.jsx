import React, { useState } from "react";

const FloatingNavBar = ({ tripId }) => {
  const handleOnClick = (name) => {};

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-100">
        <nav className="flex space-x-8">
          <button
            className={`relative px-3 py-2 text-sm font-medium bg-white text-black rounded-full transition-colors duration-200 hover:bg-gray-200 hover:text-red-400`}
          >
            {" "}
            <a href={`http://localhost:5173/view-trip/${tripId}`}>Planning</a>
          </button>
          <button
            className={`relative px-3 py-2 text-sm font-medium bg-white text-black rounded-full transition-colors duration-200 hover:bg-gray-200 hover:text-red-400`}
          >
            {" "}
            <a href={`http://localhost:5173/chat-room/${tripId}`}>People</a>
          </button>
          <button
            className={`relative px-3 py-2 text-sm font-medium bg-white text-black rounded-full transition-colors duration-200 hover:bg-gray-200 hover:text-red-400`}
          >
            {" "}
            <a href={`http://localhost:5173/my-schedule/${tripId}`}>Schedule</a>
          </button>
          <button
            className={`relative px-3 py-2 text-sm font-medium bg-white text-black rounded-full transition-colors duration-200 hover:bg-gray-200 hover:text-red-400`}
          >
            <a href={`http://localhost:5173/budgeting-tool/${tripId}`}>
              Budget
            </a>
          </button>
          <button
            className={`relative px-3 py-2 text-sm font-medium bg-white text-black rounded-full transition-colors duration-200 hover:bg-gray-200 hover:text-red-400`}
          >
            {" "}
            <a href={`http://localhost:5173/booking/${tripId}`}>Booking</a>
          </button>
        </nav>
      </div>
    </div>
  );
};
export default FloatingNavBar;
