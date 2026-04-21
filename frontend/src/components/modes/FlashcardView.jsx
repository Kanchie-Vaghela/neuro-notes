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
          className="cursor-pointer bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition duration-200"
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
