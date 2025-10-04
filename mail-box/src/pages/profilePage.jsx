// src/components/ProfileModal.jsx
import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase/firebase";
import { ref, set, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfilePage({ show, onClose }) {
  const [uid, setUid] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!show) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      setUid(user.uid);
      const snapshot = await get(ref(database, `users/${user.uid}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setName(data.name || "");
        setMobile(data.mobile || "");
        setPhotoURL(data.photoURL || "");
        setEditMode(!(data.name && data.mobile && data.photoURL));
      } else {
        setName(""); setMobile(""); setPhotoURL("");
        setEditMode(true);
      }
    });
    return () => unsub();
  }, [show]);

  const handleSave = async () => {
    if (!uid) return alert("Not signed in");
    if (!name || !mobile || !photoURL) return alert("All fields are required");
    setLoading(true);
    try {
      await set(ref(database, `users/${uid}`), { name, mobile, photoURL, updatedAt: Date.now() });
      alert("Profile saved");
      setEditMode(false);
      onClose && onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">
        <button onClick={() => onClose && onClose()} className="absolute top-4 right-4 text-gray-600">✕</button>

        {!editMode ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <img src={photoURL || "https://via.placeholder.com/100"} alt="profile" className="w-24 h-24 rounded-full object-cover" />
            <h3 className="text-lg font-semibold">Name : {name || "No name"}</h3>
            <p className="text-sm text-gray-600">Contact : {mobile || "No mobile"}</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-indigo-600 text-white rounded">Edit</button>
              <button onClick={() => onClose && onClose()} className="px-4 py-2 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Edit Profile</h3>
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" className="px-3 py-2 border rounded" />
            <input value={mobile} onChange={(e)=>setMobile(e.target.value)} placeholder="Mobile number" className="px-3 py-2 border rounded" />
            <input value={photoURL} onChange={(e)=>setPhotoURL(e.target.value)} placeholder="Profile photo URL" className="px-3 py-2 border rounded" />
            <div className="flex justify-end gap-3 mt-3">
              <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
