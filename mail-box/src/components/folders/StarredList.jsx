import React from "react";
import { ref, remove, set } from "firebase/database";
import { database } from "../../firebase/firebase";

export default function StarredList({ mails = [], userId }) {
  const handleUnstar = async (mail) => {
    try {
      await remove(ref(database, `mails/${userId}/starred/${mail.firebaseKey}`));
      await set(ref(database, `mails/${userId}/inbox/${mail.firebaseKey}`), {
        ...mail,
        starred: false,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to unstar");
    }
  };

  const handleDelete = async (mail) => {
    if (!window.confirm("Are you sure you want to delete this mail?")) return;

    try {
      await set(ref(database, `mails/${userId}/bin/${mail.firebaseKey}`), mail);
      await remove(ref(database, `mails/${userId}/starred/${mail.firebaseKey}`));
      alert("Mail moved to bin");
    } catch (err) {
      console.error(err);
      alert("Failed to delete mail");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {mails.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No starred mails</p>
      ) : (
        mails.map((m) => (
          <div
            key={m.firebaseKey}
            className="p-4 rounded-xl shadow-md bg-white/60 hover:bg-gray-50"
          >
            <p className="text-sm text-gray-600">
              {m.from ? `From: ${m.from}` : `To: ${m.to}`}
            </p>
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              {m.subject} <span className="text-yellow-500">★</span>
            </h3>
            <p
              className="text-sm text-gray-700 mt-2"
              dangerouslySetInnerHTML={{ __html: m.body }}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleUnstar(m)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                ☆ Unstar
              </button>
              <button
                onClick={() => handleDelete(m)}
                className="px-3 py-1 bg-red-300 rounded"
              >
                🗑 Delete
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(m.timestamp).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
