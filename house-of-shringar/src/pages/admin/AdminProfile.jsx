// src/pages/admin/AdminProfile.jsx
import React, { useEffect, useState } from "react";
import { getUserFromDB, setUserInDB, getAllUsers } from "../../api/dbAPI";

export default function AdminProfile() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await getAllUsers();
        // getAllUsers returns object keyed by uid
        if (raw) setUsers(Object.entries(raw).map(([uid, val])=>({ uid, ...val })));
      } catch (err) { console.error(err); }
    })();
  }, []);

  const loadUser = async (uid) => {
    try {
      const data = await getUserFromDB(uid);
      setSelected({ uid, ...data });
      setEditing(true);
    } catch (err) { console.error(err); }
  };

  const save = async () => {
    try {
      await setUserInDB(selected.uid, { email: selected.email, name: selected.name, phone: selected.phone, role: selected.role });
      alert("Saved");
      setEditing(false);
    } catch (err) { console.error(err); alert("Failed to save"); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl mb-4">Manage Users</h2>
      <div className="grid grid-cols-3 gap-3">
        {users.map(u => (
          <div key={u.uid} className="p-3 bg-white rounded shadow">
            <div className="font-semibold">{u.email}</div>
            <div className="text-sm">{u.role}</div>
            <button className="mt-2 bg-blue-600 text-white px-2 py-1 rounded" onClick={()=>loadUser(u.uid)}>Edit</button>
          </div>
        ))}
      </div>

      {editing && selected && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Edit {selected.email}</h3>
          <label className="block mt-1">Name</label>
          <input value={selected.name || ""} onChange={(e)=>setSelected({...selected, name: e.target.value})} className="border p-2 w-full" />
          <label className="block mt-1">Role</label>
          <select value={selected.role || "user"} onChange={(e)=>setSelected({...selected, role:e.target.value})} className="border p-2 w-full">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className="mt-3">
            <button onClick={save} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
            <button onClick={()=>{setEditing(false); setSelected(null);}} className="ml-2 bg-gray-300 px-3 py-1 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
