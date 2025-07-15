import React from "react";
import Header from "./Components/Header";
import ProductList from "./Components/Products/ProductList";
import CartProvider from "./Components/Context/CartProvider";

function App() {
  return (
    <CartProvider>
      <Header></Header>
      <ProductList></ProductList>
    </CartProvider>
  );
}

export default App;
