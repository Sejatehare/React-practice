import React from "react";
import { ref, remove, push } from "firebase/database";
import { database } from "../../firebase/firebase";

export default function BinList({ mails = [], userId }) {
  const handleRestore = async (mail) => {
    try {
      await push(ref(database, `mails/${userId}/inbox`), mail);
      await remove(ref(database, `mails/${userId}/bin/${mail.firebaseKey}`));
    } catch (err) {
      console.error(err);
      alert("Failed to restore");
    }
  };

  const handleDeletePermanent = async (mail) => {
    if (!window.confirm("Are you sure you want to permanently delete this mail?")) return;

    try {
      await remove(ref(database, `mails/${userId}/bin/${mail.firebaseKey}`));
    } catch (err) {
      console.error(err);
      alert("Failed to delete permanently");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {mails.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No mails</p>
      ): (
        mails.map((m) => (
        <div key={m.firebaseKey} className="p-4 rounded-xl shadow-md bg-white/60">
          <p className="text-sm text-gray-600">{m.from ? `From: ${m.from}` : `To: ${m.to}`}</p>
          <h3 className="font-semibold text-gray-800">{m.subject}</h3>
          <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: m.body || "" }} />
          <div className="flex gap-2 mt-3">
            <button onClick={() => handleRestore(m)} className="px-3 py-1 bg-green-300 rounded">
              Restore
            </button>
            <button onClick={() => handleDeletePermanent(m)} className="px-3 py-1 bg-red-300 rounded">
              Delete
            </button>
          </div>
        </div>
      ))
      )}
    </div>
  );
}
