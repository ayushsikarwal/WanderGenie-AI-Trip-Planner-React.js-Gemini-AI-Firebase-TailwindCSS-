import React from 'react'

function AdditionalComponentsForPlanType(props) {
  return (
    <div className="p-4 space-y-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
      <div className="text-2xl sm:text-3xl">{props.logo}</div>
      <div className="text-base sm:text-lg font-bold">{props.type}</div>
      <div className="text-sm text-[#808080] line-clamp-2">{props.desc}</div>
    </div>
  );
}

export default AdditionalComponentsForPlanType