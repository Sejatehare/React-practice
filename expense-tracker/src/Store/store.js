import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth-slice";
import userReducer from "./userSlice";
import expenseReducer from "./expense-slice";
import themeReducer from "./theme-slice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  expenses: expenseReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user", "expense", "theme"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;
