import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { markMailAsRead } from "../../store/mailSlice";
import { ref, set, remove, update } from "firebase/database";
import { database } from "../../firebase/firebase";

export default function InboxList({ mails = [], userId }) {
  const dispatch = useDispatch();
  const [selectedMail, setSelectedMail] = useState(null);

  const handleOpenMail = (mail) => {
    setSelectedMail(mail);
    if (!mail.read) {
      dispatch(
        markMailAsRead({
          userKey: userId,
          firebaseKey: mail.firebaseKey,
          folder: "inbox",
        })
      );
    }
  };

  const handleBack = () => setSelectedMail(null);

  const handleStar = async (mail) => {
    try {
      await set(ref(database, `mails/${userId}/starred/${mail.firebaseKey}`), {
        ...mail,
        starred: true,
      });
      await update(ref(database, `mails/${userId}/inbox/${mail.firebaseKey}`), {
        starred: true,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to star");
    }
  };

  const handleUnstar = async (mail) => {
    try {
      await remove(ref(database, `mails/${userId}/starred/${mail.firebaseKey}`));
      await update(ref(database, `mails/${userId}/inbox/${mail.firebaseKey}`), {
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
      await remove(ref(database, `mails/${userId}/inbox/${mail.firebaseKey}`));
      await remove(ref(database, `mails/${userId}/starred/${mail.firebaseKey}`));
    } catch (err) {
      console.error(err);
      alert("Failed to move to bin");
    }
  };

  if (selectedMail) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md">
        <button onClick={handleBack} className="text-blue-500 hover:underline mb-3">
          ← Back to Inbox
        </button>
        <h3 className="text-xl font-semibold mb-2">{selectedMail.subject}</h3>
        <p className="text-gray-600 text-sm mb-2">
          From: {selectedMail.from} <br />
          To: {selectedMail.to}
        </p>
        <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: selectedMail.body }} />
        <p className="text-xs text-gray-500 mt-3">
          {new Date(selectedMail.timestamp).toLocaleString()}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {mails.map((m) => (
        <div
          key={m.firebaseKey}
          onClick={() => handleOpenMail(m)}
          className={`p-4 rounded-xl shadow-md bg-white cursor-pointer hover:bg-gray-50 ${
            !m.read ? "border-l-4 border-blue-500 font-semibold" : "font-normal"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">From: {m.from}</p>
              <h3 className="text-gray-800 flex items-center gap-2">
                {m.subject}
                {m.starred && <span className="text-yellow-500">★</span>}
              </h3>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              {!m.starred ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStar(m);
                  }}
                  className="px-3 py-1 bg-yellow-300 rounded"
                >
                  ★ Star
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnstar(m);
                  }}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  ☆ Unstar
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(m);
                }}
                className="px-3 py-1 bg-red-300 rounded"
              >
                🗑 Move
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(m.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
