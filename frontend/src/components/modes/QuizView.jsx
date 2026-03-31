import React, { useState } from "react";

const QuizView = ({ data }) => {
  const [selected, setSelected] = useState({});

  const handleSelect = (qIndex, optionIndex) => {
    setSelected((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  return (
    <div className="space-y-5">
      {data.map((q, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
        >
          {/* Question */}
          <p className="text-gray-800 font-medium mb-3">
            {q.question}
          </p>

          {/* Options */}
          <div className="space-y-2">
            {q.options.map((opt, j) => {
              const isSelected = selected[i] === j;
              const isCorrect = q.correctIndex === j;

              return (
                <div
                  key={j}
                  onClick={() => handleSelect(i, j)}
                  className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition
                    ${
                      isSelected
                        ? isCorrect
                          ? "bg-green-200"
                          : "bg-red-200"
                        : "bg-gray-100 hover:bg-indigo-100"
                    }
                  `}
                >
                  {opt}
                </div>
              );
            })}
          </div>

          {/* Feedback */}
          {selected[i] !== undefined && (
            <p className="mt-3 text-sm text-gray-500">
              {selected[i] === q.correctIndex
                ? "Correct ✅"
                : "Wrong ❌"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizView;