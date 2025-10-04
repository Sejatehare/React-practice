import { configureStore } from "@reduxjs/toolkit";
import mailReducer from "./mailSlice";

export const store = configureStore({
  reducer: {
    mail: mailReducer,
  },
});
