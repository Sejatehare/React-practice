import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth, database } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";

import ComposeMail from "../components/folders/Composemail";
import ProfilePage from "./profilePage";
import InboxList from "../components/folders/InboxList";
import SentList from "../components/folders/SentList";
import BinList from "../components/folders/BinList";
import StarredList from "../components/folders/StarredList";

import { emailToKey } from "../firebase/firebaseKey";
import { listenMails } from "../store/mailSlice";

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mails = useSelector((state) => state.mail.mails);
  const unreadCount = useSelector((state) => state.mail.unreadCount);

  const [active, setActive] = useState("Inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [userKey, setUserKey] = useState(null);
  const menuItems = ["Compose", "Inbox", "Sent", "Bin", "Starred"];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      setCurrentUser(user);
      const key = emailToKey(user.email);
      setUserKey(key);

      const profileRef = ref(database, `users/${user.uid}`);
      onValue(profileRef, (snap) => {
        setProfilePhoto(snap.val()?.photoURL || null);
      });

      dispatch(listenMails(key));
    });

    return () => unsub();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!userKey) return;
    const interval = setInterval(() => {
      dispatch(listenMails(userKey));
    }, 2000);

    return () => clearInterval(interval);
  }, [dispatch, userKey]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/login");
  };

  const inbox = mails.filter((m) => m.folder === "inbox");
  const sent = mails.filter((m) => m.folder === "sent");
  const starred = mails.filter((m) => m.folder === "starred");
  const bin = mails.filter((m) => m.folder === "bin");

  const renderMain = () => {
    switch (active) {
      case "Inbox":
        return <InboxList mails={inbox} userId={userKey} />;
      case "Sent":
        return <SentList mails={sent} />;
      case "Bin":
        return <BinList mails={bin} userId={userKey} />;
      case "Starred":
        return <StarredList mails={starred} userId={userKey} />;
      case "Compose":
        return <div className="text-center">Click Compose (or press Compose button)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900">
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
              className={`text-left px-5 py-3 rounded-lg font-medium transition ${
                active === item
                  ? "bg-gradient-to-r from-purple-400 to-blue-400 text-white shadow-md"
                  : "text-gray-800 hover:bg-purple-200/60"
              }`}
            >
              {item === "Inbox" ? (
                <div className="flex items-center justify-between w-full">
                  <span>{item}</span>
                  {unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
                  )}
                </div>
              ) : (
                item
              )}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">{active}</h1>
          <div className="flex items-center gap-4">
            <img
              src={profilePhoto || "https://via.placeholder.com/40"}
              alt="profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow-md"
              onClick={() => setShowProfile(true)}
            />
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-gradient-to-r from-pink-300 to-red-400 text-white rounded-full shadow-md"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{renderMain()}</main>
      </div>

      <ComposeMail
        show={showCompose}
        onClose={() => {
          setShowCompose(false);
          setActive("Inbox");
        }}
      />
      <ProfilePage show={showProfile} onClose={() => setShowProfile(false)} />
    </div>
  );
}
