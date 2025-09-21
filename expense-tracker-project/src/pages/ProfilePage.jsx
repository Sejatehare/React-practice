import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { writeUserProfile, readUserProfile } from "../firebase/firebaseHelpers";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const expenses = useSelector((state) => state.expenses.expenses || []);


  // Fetch profile from Firebase
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const profile = await readUserProfile(user.uid);
      if (profile?.name && profile?.mobile) {
        setName(profile.name);
        setMobile(profile.mobile);
        setProfileCompleted(true);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  async function saveProfile() {
    if (!user) return toast.error("Not logged in");
    if (!name || !mobile) return toast.error("Fill all fields");

    await writeUserProfile(user.uid, { name, mobile, email: user.email });
    toast.success("Profile saved");
    setProfileCompleted(true);
  }

  function downloadExpenses() {
    // fetch expenses from Redux store (fallback to localStorage)
    if (expenses.length === 0) {
      toast.error("No expenses to download");
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Title,Amount,Type", ...expenses.map((e) => `${e.title},${e.amount},${e.type}`)].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "expenses.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Expenses downloaded");
  }

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto bg-white/80 dark:bg-gray-800/80 p-6 rounded-md shadow">
      <h2 className="text-xl font-medium mb-4">Profile</h2>

      {!profileCompleted ? (
        // Profile Incomplete → Show form
        <div className="space-y-3">
          <input
            className="w-full p-2 rounded border"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-2 rounded border"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <input
            className="w-full p-2 rounded border bg-gray-100"
            value={user?.email || ""}
            disabled
          />
          <div className="flex gap-3">
            <button
              onClick={saveProfile}
              className="px-4 py-2 bg-indigo-600 text-white rounded w-full"
            >
              Save Profile
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border rounded w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // Profile Completed → Show details
        <div className="space-y-4">
          <p><span className="font-semibold">Name:</span> {name}</p>
          <p><span className="font-semibold">Mobile:</span> {mobile}</p>
          <p><span className="font-semibold">Email:</span> {user?.email}</p>

          <div className="center grid grid-cols-2 gap-4">
            <button
              onClick={downloadExpenses}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Download Expenses
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
