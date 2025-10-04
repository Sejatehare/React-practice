// src/components/HomePage.jsx
import React, { useEffect, useState } from "react";
import { auth, database } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import ComposeMail from "../components/folders/Composemail";
import ProfilePage from "./profilePage";
import InboxList from "../components/folders/InboxList";
import SentList from "../components/folders/SentList";
import BinList from "../components/folders/BinList";
import StarredList from "../components/folders/StarredList";
import { emailToKey } from "../firebase/firebaseKey";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [bin, setBin] = useState([]);
  const [starred, setStarred] = useState([]);

  const menuItems = ["Compose", "Inbox", "Sent", "Bin", "Starred"];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      setCurrentUser(user);
      // profile listener
      const profileRef = ref(database, `users/${user.uid}`);
      onValue(profileRef, (snap) => {
        const data = snap.val();
        setProfilePhoto(data?.photoURL || null);
      });

      // mailbox listeners
      const key = emailToKey(user.email);
      const inboxRef = ref(database, `mails/${key}/inbox`);
      const sentRef = ref(database, `mails/${key}/sent`);
      const binRef = ref(database, `mails/${key}/bin`);
      const starredRef = ref(database, `mails/${key}/starred`);

      onValue(inboxRef, (snap) => {
        const val = snap.val();
        setInbox(val ? Object.values(val).sort((a,b)=>b.timestamp-a.timestamp) : []);
      });
      onValue(sentRef, (snap) => {
        const val = snap.val();
        setSent(val ? Object.values(val).sort((a,b)=>b.timestamp-a.timestamp) : []);
      });
      onValue(binRef, (snap) => {
        const val = snap.val();
        setBin(val ? Object.values(val).sort((a,b)=>b.timestamp-a.timestamp) : []);
      });
      onValue(starredRef, (snap) => {
        const val = snap.val();
        setStarred(val ? Object.values(val).sort((a,b)=>b.timestamp-a.timestamp) : []);
      });
    });
    return () => unsub();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userUid");
    navigate("/login");
  };

  const renderMain = () => {
    if (active === "Inbox") return <InboxList mails={inbox} />;
    if (active === "Sent") return <SentList mails={sent} />;
    if (active === "Bin") return <BinList mails={bin} />;
    if (active === "Starred") return <StarredList mails={starred} />;
    if (active === "Compose") return <div className="text-center">Click Compose (or press the Compose button)</div>;
    return null;
  };

  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-l from-purple-100 to-blue-100 shadow-xl flex flex-col">
        <h2 className="text-2xl font-bold p-6 text-gray-800">📨 Mailbox</h2>
        <nav className="flex flex-col gap-2 px-4 mt-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActive(item);
                if (item === "Compose") setShowCompose(true);
              }}
              className={`text-left px-5 py-3 rounded-lg font-medium transition ${active === item ? "bg-gradient-to-r from-purple-400 to-blue-400 text-white shadow-md" : "text-gray-800 hover:bg-purple-200/60"}`}
            >
              {item === "Compose" && "✉️ "}
              {item === "Inbox" && "📥 "}
              {item === "Sent" && "📤 "}
              {item === "Bin" && "🗑️ "}
              {item === "Starred" && "⭐ "}
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">{active}</h1>
          <div className="flex items-center gap-4">
            <img src={profilePhoto || "https://via.placeholder.com/40"} alt="profile" className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-md" onClick={() => setShowProfile(true)} />
            <button onClick={handleLogout} className="px-5 py-2 bg-gradient-to-r from-pink-300 to-red-400 text-white rounded-full shadow-md">Logout</button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{renderMain()}</main>
      </div>

      <ComposeMail show={showCompose} onClose={() => { setShowCompose(false); setActive("Inbox"); }} />
      <ProfilePage show={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}
