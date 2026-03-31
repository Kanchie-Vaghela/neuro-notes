import React from "react";

const SummaryView = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
      
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Summary
      </h2>

      <ul className="list-disc pl-5 space-y-2">
        {data.map((point, i) => (
          <li key={i} className="text-gray-700 leading-relaxed">
            {point}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default SummaryView;