import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; 
import productsReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    categories: categoryReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});

export default store;
