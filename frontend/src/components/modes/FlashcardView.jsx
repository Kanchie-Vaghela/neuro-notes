import React, { useState } from "react";

const FlashcardView = ({ data }) => {
  const [flipped, setFlipped] = useState({});

  const handleFlip = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {data.map((card, i) => (
    <div
      key={i}
      onClick={() => handleFlip(i)}
      className={`cursor-pointer p-5 rounded-2xl border shadow-sm transition duration-300
       ${flipped[i] 
  ? "bg-green-50 border-green-200 scale-[1.02]" 
  : "bg-white border-gray-200 hover:scale-[1.01]"}
      `}
    >
      <p className="text-sm text-gray-800 mb-2">
        {flipped[i] ? card.a : card.q}
      </p>
    </div>
  ))}
</div>
  );
};

export default FlashcardView;
