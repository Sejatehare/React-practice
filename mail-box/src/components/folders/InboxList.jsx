import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { markMailAsRead } from "../../store/mailSlice";
import { ref, push } from "firebase/database";
import { database } from "../../firebase/firebase";
import { emailToKey } from "../../firebase/firebaseKey";

export default function InboxList({ mails = [], userId, onRefresh }) {
  const dispatch = useDispatch();
  const [selectedMail, setSelectedMail] = useState(null);

  const handleOpenMail = (mail) => {
    setSelectedMail(mail);
    if (!mail.read) {
      dispatch(markMailAsRead({ userId, mailId: mail.id }));
    }
  };

  const handleBack = () => setSelectedMail(null);

  const handleStar = async (mail) => {
    try {
      await push(ref(database, `mails/${emailToKey(mail.to)}/starred`), mail);
      alert("Starred successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to star");
    }
  };

  const handleDelete = async (mail) => {
    try {
      await push(ref(database, `mails/${emailToKey(mail.to)}/bin`), mail);
      alert("Moved to bin!");
      onRefresh && onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to move to bin");
    }
  };

  // 📨 Show selected mail content
  if (selectedMail) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md">
        <button
          onClick={handleBack}
          className="text-blue-500 hover:underline mb-3"
        >
          ← Back to Inbox
        </button>
        <h3 className="text-xl font-semibold mb-2">{selectedMail.subject}</h3>
        <p className="text-gray-600 text-sm mb-2">
          From: {selectedMail.from} <br />
          To: {selectedMail.to}
        </p>
        <div
          className="text-gray-800"
          dangerouslySetInnerHTML={{ __html: selectedMail.body }}
        />
        <p className="text-xs text-gray-500 mt-3">
          {new Date(selectedMail.timestamp).toLocaleString()}
        </p>
      </div>
    );
  }

  // 📬 Show mail list
  return (
    <div className="flex flex-col gap-4">
      {mails.map((m) => (
        <div
          key={m.id}
          onClick={() => handleOpenMail(m)}
          className={`p-4 rounded-xl shadow-md bg-white cursor-pointer hover:bg-gray-50 ${
            !m.read ? "border-l-4 border-blue-500 font-semibold" : "font-normal"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">From: {m.from}</p>
              <h3 className="text-gray-800">{m.subject}</h3>
              <div
                className="mt-2 text-gray-700 truncate max-w-xl"
                dangerouslySetInnerHTML={{
                  __html: m.body || m.content || "",
                }}
              />
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStar(m);
                }}
                className="px-3 py-1 bg-yellow-300 rounded"
              >
                ★ Star
              </button>
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
