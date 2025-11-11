// src/pages/admin/AdminProfile.jsx
import React, { useEffect, useState } from "react";
import { getUserFromDB, setUserInDB } from "../../api/dbAPI";

export default function AdminProfile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [admin, setAdmin] = useState(null);
  const [editing, setEditing] = useState(false);

  // 🔹 Fetch current admin details
  useEffect(() => {
    (async () => {
      try {
        if (!user?.userId) return;
        const data = await getUserFromDB(user.userId);
        setAdmin({ uid: user.userId, ...data });
      } catch (err) {
        console.error("Error fetching admin details:", err);
      }
    })();
  }, [user.userId]);

  // 🔹 Save updated details
  const saveChanges = async () => {
    try {
      await setUserInDB(admin.uid, {
        email: admin.email,
        name: admin.name,
        phone: admin.phone,
        role: admin.role || "admin",
      });
      alert("Profile updated successfully ✅");
      setEditing(false);
    } catch (err) {
      console.error("Failed to save:", err);
      alert("❌ Error saving profile");
    }
  };

  if (!admin) return <div className="p-6 text-center">Loading admin details...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Profile</h2>

      {!editing ? (
        <div>
          <div className="mb-3">
            <strong>Email:</strong> {admin.email}
          </div>
          <div className="mb-3">
            <strong>Name:</strong> {admin.name || "Not provided"}
          </div>
          <div className="mb-3">
            <strong>Phone:</strong> {admin.phone || "Not provided"}
          </div>
          <div className="mb-3">
            <strong>Role:</strong> {admin.role || "admin"}
          </div>
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            value={admin.name || ""}
            onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
            className="border p-2 rounded w-full mb-3"
          />

          <label className="block mb-1 font-semibold">Phone</label>
          <input
            type="text"
            value={admin.phone || ""}
            onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
            className="border p-2 rounded w-full mb-3"
          />

          <button
            onClick={saveChanges}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditing(false)}
            className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
