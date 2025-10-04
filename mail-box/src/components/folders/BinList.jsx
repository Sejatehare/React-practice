import React from "react";
import { database } from "../../firebase/firebase";
import { ref, remove } from "firebase/database";
import { emailToKey } from "../../firebase/firebaseKey";

export default function BinList({ mails = [] }) {
  // Note: here we show items; permanent delete requires known keys; for simple demo we won't remove original items
  const handleDeletePermanent = async (mail) => {
    // if you store keys in object, you can remove by key. For now show message.
    alert("Permanent delete is not implemented in demo (requires keys).");
  };

  const handleRestore = async (mail) => {
    alert("Restore not implemented in demo (requires keys).");
  };

  return (
    <div className="flex flex-col gap-4">
      {mails.map((m, idx) => (
        <div key={m.id || idx} className="p-4 rounded-xl shadow-md bg-white/60">
          <p className="text-sm text-gray-600">{m.from ? `From: ${m.from}` : `To: ${m.to}`}</p>
          <h3 className="font-semibold text-gray-800">{m.subject}</h3>
          <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: m.body || m.content || "" }} />
          <div className="flex gap-2 mt-3">
            <button onClick={() => handleRestore(m)} className="px-3 py-1 bg-green-300 rounded">Restore</button>
            <button onClick={() => handleDeletePermanent(m)} className="px-3 py-1 bg-red-300 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
