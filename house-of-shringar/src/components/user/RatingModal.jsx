import React, { useState } from "react";

export default function RatingModal({ onClose, onSubmit }) {
  const [rating, setRating] = useState(5);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80">
        <h3 className="text-lg font-semibold mb-4">Rate this product</h3>

        <div className="flex justify-center gap-2 text-2xl text-yellow-400 mb-6">
          {[1,2,3,4,5].map(n => (
            <button
              key={n}
              onClick={() => setRating(n)}
              className={n <= rating ? "" : "text-gray-300"}
            >
              ★
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(rating)}
            className="flex-1 bg-pink-500 text-white py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
