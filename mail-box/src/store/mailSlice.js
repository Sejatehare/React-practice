import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { database } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";

// Thunk to start listening to a user's mails
export const listenMails = createAsyncThunk(
  "mail/listenMails",
  async (userKey, { dispatch }) => {
    const mailRef = ref(database, `mails/${userKey}`);
    onValue(mailRef, (snapshot) => {
      const data = snapshot.val();
      const allMails = [];

      if (data) {
        if (data.inbox) Object.values(data.inbox).forEach((m) => allMails.push({ ...m, folder: "inbox" }));
        if (data.sent) Object.values(data.sent).forEach((m) => allMails.push({ ...m, folder: "sent" }));
        if (data.bin) Object.values(data.bin).forEach((m) => allMails.push({ ...m, folder: "bin" }));
        if (data.starred) Object.values(data.starred).forEach((m) => allMails.push({ ...m, folder: "starred" }));
      }

      dispatch(setMails(allMails));
    });
  }
);

const mailSlice = createSlice({
  name: "mail",
  initialState: { mails: [], unreadCount: 0 },
  reducers: {
    setMails(state, action) {
      state.mails = action.payload;
      state.unreadCount = action.payload.filter((m) => m.folder === "inbox" && !m.read).length;
    },
  },
});

export const { setMails } = mailSlice.actions;
export default mailSlice.reducer;
export { markMailAsRead };

