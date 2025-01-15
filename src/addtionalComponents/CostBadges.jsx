import React from 'react'

function CostBadges(props) {
  return (
    <div className="p-4 space-y-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
      <img 
        src={props.logo} 
        alt={props.type} 
        className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
      />
      <div className="text-base sm:text-lg font-bold">{props.type}</div>
      <div className="text-sm text-[#808080] line-clamp-2">{props.desc}</div>
    </div>
  );
}

export default CostBadges