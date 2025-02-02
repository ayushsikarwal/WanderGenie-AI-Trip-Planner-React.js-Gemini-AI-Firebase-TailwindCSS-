import React, { useState } from "react";

export const Calender = () => {
  const [selectedDate, setSelectedDate] = useState(13);

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="min-w-[1200px] flex gap-8 bg-white rounded-xl p-8">
      <div className="w-3/5">
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">January 2025</h2>
        </header>

        <div className="grid grid-cols-7 gap-2 text-sm mb-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div key={day} className="font-medium text-center">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => (
            <div
              key={day}
              className={`h-12 flex items-center justify-center cursor-pointer rounded-full transition-all ${
                selectedDate === day ? "bg-black text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>


    <div>
    <div className="w-2/5 bg-gray-50 rounded-xl p-6">
    	    <div className="flex items-center justify-between mb-8">
    	      <h3 className="text-xl font-semibold">{selectedDate} January 25</h3>
    	      <button className="px-4 py-2 border rounded-full hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
    	        
    	        Add Place
    	      </button>
    	    </div>
    	
    	    <div className="space-y-4">
    	       <div className="relative">
    	        <div className="absolute left-0 w-px h-full bg-gray-200 top 0"></div>
    	        <div className="grid grid-cols-[60px_1fr] gap-4">
    	          <div className="text-sm text-gray-500">10 AM</div>
    	          <div className="p-3 bg-red-100 rounded-lg">
    	            <h4 className="font-medium">Visit Doi Suthep Temple</h4>
    	            <p className="text-sm text-gray-600">Marvel at the golden pagoda and enjoy stunning city views</p>
    	          </div>
    	        </div>
    	      </div>
    	
    	      {/*<div className="relative">
    	         <div className="absolute left-0 w-px h-full bg-gray-200"></div>
    	        <div className="grid grid-cols-[60px_1fr] gap-4">
    	          <div className="text-sm text-gray-500">1 PM</div>
    	          <div className="p-3 bg-red-100 rounded-lg">
    	            <h4 className="font-medium">Explore Chiang Mai Old City</h4>
    	            <p className="text-sm text-gray-600">Wander through ancient streets and visit historic temples like Wat Chedi Luang</p>
    	          </div>
    	        </div>
    	      </div>*/}
    	
    	      <div className="relative">
    	        <div className="absolute left-0 w-px h-full bg-gray-200"></div>
    	        <div className="grid grid-cols-[60px_1fr] gap-4">
    	          <div className="text-sm text-gray-500">4 PM</div>
    	          <div className="p-3 bg-green-100 rounded-lg">
    	            <h4 className="font-medium">Take a Thai Cooking Class</h4>
    	            <p className="text-sm text-gray-600">Learn to cook authentic Thai dishes with local ingredients</p>
    	          </div>
    	        </div>
    	      </div>
    	
    	      <div className="relative">
    	        <div className="absolute left-0 w-px h-full bg-gray-200"></div>
    	        <div className="grid grid-cols-[60px_1fr] gap-4">
    	          <div className="text-sm text-gray-500">6 PM</div>
    	          <div className="p-3 bg-yellow-50 rounded-lg">
    	            <h4 className="font-medium">Visit an Elephant Sanctuary</h4>
    	            <p className="text-sm text-gray-600">Interact ethically with elephants in a natural setting</p>
    	          </div>
    	        </div>
    	      </div>
    	
    	      <div className="relative">
    	        <div className="absolute left-0 w-px h-full bg-gray-200"></div>
    	        <div className="grid grid-cols-[60px_1fr] gap-4">
    	          <div className="text-sm text-gray-500">8 PM</div>
    	          <div className="p-3 bg-purple-100 rounded-lg">
    	            <h4 className="font-medium">Shop at Chiang Mai Night Bazaar</h4>
    	            <p className="text-sm text-gray-600">Discover unique handicrafts, souvenirs, and delicious street food</p>
    	          </div>
    	        </div>
    	      </div>
    	    </div>
    	  </div> 
    </div>
    
    </div>
  );
};
