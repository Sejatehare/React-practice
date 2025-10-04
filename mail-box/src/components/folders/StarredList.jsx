import React from "react";

export default function StarredList({ mails = [] }) {
  return (
    <div className="flex flex-col gap-4">
      {mails.map((m, idx) => (
        <div key={m.id || idx} className="p-4 rounded-xl shadow-md bg-white/60">
          <p className="text-sm text-gray-600">{m.from ? `From: ${m.from}` : `To: ${m.to}`}</p>
          <h3 className="font-semibold text-gray-800">{m.subject}</h3>
          <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: m.body || m.content || "" }} />
          <p className="text-xs text-gray-500 mt-2">{new Date(m.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
