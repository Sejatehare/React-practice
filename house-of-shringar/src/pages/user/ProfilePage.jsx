// src/pages/user/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFromDB, setUserInDB } from "../../api/dbAPI";

export default function ProfilePage() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const uid = storedUser?.uid || storedUser?.userId || storedUser?.id || null;

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: storedUser?.email || "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const load = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }
      try {
        const dbUser = await getUserFromDB(uid);
        if (dbUser) {
          setProfile({
            name: dbUser.name || "",
            email: dbUser.email || storedUser?.email || "",
            phone: dbUser.phone || "",
            address: dbUser.address || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid, storedUser?.email]);

  const handleSave = async () => {
    if (!uid) return alert("User ID missing.");
    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        role: storedUser?.role || "user",
      };
      await setUserInDB(uid, payload);

      // Update localStorage so other pages can read uid/email easily
      const newLocal = { ...storedUser, uid, email: payload.email, name: payload.name };
      localStorage.setItem("user", JSON.stringify(newLocal));

      alert("Profile updated");
      setEditing(false);
    } catch (err) {
      console.error("Profile save failed:", err);
      alert("Failed to save profile.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      <div className="bg-white p-6 rounded shadow">
        {!editing ? (
          <>
            <div className="mb-2"><b>Name:</b> {profile.name || "—"}</div>
            <div className="mb-2"><b>Email:</b> {profile.email}</div>
            <div className="mb-2"><b>Phone:</b> {profile.phone || "—"}</div>
            <div className="mb-2"><b>Address:</b> {profile.address || "—"}</div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-3 py-1 rounded">Edit Profile</button>
              <button onClick={() => navigate("/user/orders")} className="bg-gray-200 px-3 py-1 rounded">View My Orders</button>
              <button onClick={() => navigate("/user/wishlist")} className="bg-pink-600 text-white w-full p-2 rounded hover:bg-pink-700">View Wishlist 💖</button>
            </div>
          </>
        ) : (
          <>
            <label className="block mb-1">Name</label>
            <input value={profile.name} onChange={(e)=>setProfile({...profile, name: e.target.value})} className="border p-2 w-full mb-2" />

            <label className="block mb-1">Email</label>
            <input value={profile.email} onChange={(e)=>setProfile({...profile, email: e.target.value})} className="border p-2 w-full mb-2" />

            <label className="block mb-1">Phone</label>
            <input value={profile.phone} onChange={(e)=>setProfile({...profile, phone: e.target.value})} className="border p-2 w-full mb-2" />

            <label className="block mb-1">Address</label>
            <textarea value={profile.address} onChange={(e)=>setProfile({...profile, address: e.target.value})} className="border p-2 w-full mb-2" rows="3" />

            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
              <button onClick={()=>setEditing(false)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
