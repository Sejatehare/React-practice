import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyBKoNrAPzue0Ipo-iUoNmKBEku1XhjFd7Q",
  authDomain: "e-commerce-bd80c.firebaseapp.com",
  databaseURL: "https://e-commerce-bd80c-default-rtdb.firebaseio.com",
  projectId: "e-commerce-bd80c",
  storageBucket: "e-commerce-bd80c.firebasestorage.app",
  messagingSenderId: "183603693913",
  appId: "1:183603693913:web:f3a5689a743dbaab4f6448",
});

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;