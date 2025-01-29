import React, { useState } from 'react';

const FloatingNavBar = () => {
  const [activeTab, setActiveTab] = useState('Planning');

  const navItems = [
    'Planning',
    'People',
    'Schedule',
    'Budget',
    'Booking'
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-100">
        <nav className="flex space-x-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200
                ${activeTab === item 
                  ? 'text-black' 
                  : 'text-gray-500 hover:text-gray-800'
                }`}
            >
              {item}
              {activeTab === item && (
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-black rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default FloatingNavBar;