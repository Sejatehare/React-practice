import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { database } from "../firebase/firebase";
import { ref, onValue, update } from "firebase/database";

export const listenMails = createAsyncThunk(
  "mail/listenMails",
  async (userKey, { dispatch }) => {
    const mailRef = ref(database, `mails/${userKey}`);
    onValue(mailRef, (snapshot) => {
      const data = snapshot.val() || {};
      const all = [];

      if (data.inbox) {
        Object.entries(data.inbox).forEach(([firebaseKey, mail]) =>
          all.push({ ...mail, firebaseKey, folder: "inbox" })
        );
      }
      if (data.sent) {
        Object.entries(data.sent).forEach(([firebaseKey, mail]) =>
          all.push({ ...mail, firebaseKey, folder: "sent" })
        );
      }
      if (data.bin) {
        Object.entries(data.bin).forEach(([firebaseKey, mail]) =>
          all.push({ ...mail, firebaseKey, folder: "bin" })
        );
      }
      if (data.starred) {
        Object.entries(data.starred).forEach(([firebaseKey, mail]) =>
          all.push({ ...mail, firebaseKey, folder: "starred" })
        );
      }

      const normalized = all.map((m) => ({ ...m, timestamp: m.timestamp ? Number(m.timestamp) : Date.now() }));
      normalized.sort((a, b) => b.timestamp - a.timestamp);

      dispatch(setMails(normalized));
    });

    return true; 
  }
);

export const markMailAsRead = createAsyncThunk(
  "mail/markMailAsRead",
  async ({ userKey, firebaseKey, folder = "inbox" }) => {
    const mailRef = ref(database, `mails/${userKey}/${folder}/${firebaseKey}`);
    await update(mailRef, { read: true });
    return { userKey, firebaseKey, folder };
  }
);

const mailSlice = createSlice({
  name: "mail",
  initialState: {
    mails: [],
    unreadCount: 0,
    loading: false,
  },
  reducers: {
    setMails(state, action) {
      state.mails = action.payload;
      state.unreadCount = action.payload.filter((m) => m.folder === "inbox" && !m.read).length;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenMails.pending, (state) => {
        state.loading = true;
      })
      .addCase(listenMails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markMailAsRead.fulfilled, (state, action) => {
        const { firebaseKey, folder } = action.payload;
        const mail = state.mails.find((m) => m.firebaseKey === firebaseKey && m.folder === folder);
        if (mail) mail.read = true;
        state.unreadCount = state.mails.filter((m) => m.folder === "inbox" && !m.read).length;
      });
  },
});

export const { setMails } = mailSlice.actions;
export default mailSlice.reducer;
