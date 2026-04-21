import React from "react";

const SummaryView = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Summary
      </h2>

      <ul className="list-disc pl-6 space-y-3">
        {data.map((point, i) => (
          <li key={i} className="text-gray-700 leading-relaxed text-base">
            {point}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default SummaryView;