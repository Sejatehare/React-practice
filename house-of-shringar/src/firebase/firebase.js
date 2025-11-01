// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKoNrAPzue0Ipo-iUoNmKBEku1XhjFd7Q",
  authDomain: "e-commerce-bd80c.firebaseapp.com",
  databaseURL: "https://e-commerce-bd80c-default-rtdb.firebaseio.com",
  projectId: "e-commerce-bd80c",
  storageBucket: "e-commerce-bd80c.firebasestorage.app",
  messagingSenderId: "183603693913",
  appId: "1:183603693913:web:f3a5689a743dbaab4f6448",
  measurementId: "G-QX3BQ8M2KP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, database, storage };
