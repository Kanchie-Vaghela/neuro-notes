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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((q, i) => (
        <div
          key={i}
          className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm"
        >
          {/* Question */}
          <p className="text-gray-800 font-medium mb-4">
            {q.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, j) => {
              const isSelected = selected[i] === j;
              const isCorrect = q.correctIndex === j;

              return (
                <div
                  key={j}
                  onClick={() => selected[i] === undefined && handleSelect(i, j)}
                  className={`px-4 py-3 rounded-lg text-sm transition
                    ${selected[i] !== undefined
                      ? isCorrect
                        ? "bg-green-100 border-2 border-green-300"
                        : selected[i] === j
                          ? "bg-red-100 border-2 border-red-300"
                          : "bg-gray-50 border-2 border-transparent"
                      : "bg-gray-50 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-200 cursor-pointer"
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
            <p className="mt-4 text-sm text-gray-500">
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