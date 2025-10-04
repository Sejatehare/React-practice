import React, { useState } from "react";
import ReactQuill from "react-quill";
import { v4 as uuidv4 } from "uuid";
import { database, auth } from "../../firebase/firebase";
import { ref, push } from "firebase/database";
import { emailToKey } from "../../firebase/firebaseKey";

export default function ComposeMail({ show, onClose }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = auth.currentUser;
  const senderEmail = (currentUser && currentUser.email) || localStorage.getItem("userEmail");

  const handleSend = async () => {
    if (!to || !subject || !body) {
      alert("All fields are required");
      return;
    }
    if (!senderEmail) {
      alert("You must be logged in to send mail");
      return;
    }
    setLoading(true);
    const mailId = uuidv4();
    const data = {
      id: mailId,
      from: senderEmail,
      to,
      subject,
      body,
      timestamp: Date.now(),
    };

    try {
      await push(ref(database, `mails/${emailToKey(to)}/inbox`), data);
      await push(ref(database, `mails/${emailToKey(senderEmail)}/sent`), data);
      alert("Mail sent!");
      setTo(""); setSubject(""); setBody("");
      onClose && onClose();
    } catch (err) {
      console.error("Send error:", err);
      alert("Failed to send mail.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 relative">
        <button onClick={() => onClose && onClose()} className="absolute top-4 right-4 text-gray-600">✕</button>
        <h3 className="text-xl font-bold mb-4">Compose Mail</h3>

        <input type="email" placeholder="To" value={to} onChange={(e)=>setTo(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" />
        <input placeholder="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" />
        <div className="mb-3">
          <ReactQuill theme="snow" value={body} onChange={setBody} />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => onClose && onClose()} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSend} disabled={loading} className={`px-4 py-2 rounded ${loading ? "bg-gray-300" : "bg-indigo-600 text-white"}`}>{loading ? "Sending..." : "Send"}</button>
        </div>
      </div>
    </div>
  );
}
