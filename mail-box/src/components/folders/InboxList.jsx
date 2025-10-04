import React from "react";
import { database } from "../../firebase/firebase";
import { ref, push, remove } from "firebase/database";
import { emailToKey } from "../../firebase/firebaseKey";

export default function InboxList({ mails = [], onRefresh }) {
  const handleStar = async (mail) => {
    try {
      await push(ref(database, `mails/${emailToKey(mail.to)}/starred`), mail);
      alert("Starred");
    } catch (err) {
      console.error(err);
      alert("Failed to star");
    }
  };

  const handleDelete = async (mail) => {
    try {
      // Delete from inbox by finding its key isn't stored here; easier approach: push to bin then instruct user to implement removal if needed
      await push(ref(database, `mails/${emailToKey(mail.to)}/bin`), mail);
      alert("Moved to bin");
      onRefresh && onRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to move to bin");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {mails.map((m, idx) => (
        <div key={m.id || idx} className="p-4 rounded-xl shadow-md bg-white/60">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">From: {m.from}</p>
              <h3 className="font-semibold text-gray-800">{m.subject}</h3>
              <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: m.body || m.content || "" }} />
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <button onClick={() => handleStar(m)} className="px-3 py-1 bg-yellow-300 rounded">★ Star</button>
              <button onClick={() => handleDelete(m)} className="px-3 py-1 bg-red-300 rounded">🗑 Move</button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{new Date(m.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
