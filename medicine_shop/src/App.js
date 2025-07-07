import React, {useState} from "react";
import Header from "./components/layout/Header";
import Cart from "./components/cart/Cart";
import List from "./components/store/list";

function App() {
  const [ShowCart, setShowCart] = useState(false);

  const showCartHandler = () => {
    setShowCart(true);
  }

  const hideCartHandler = () => {
    setShowCart(false);
  }

  const OrderHandler = () => {
    alert("Place Order");
  }

  return (
    <>
      {ShowCart && <Cart onClose={hideCartHandler} OnOrder={OrderHandler} />}
      <Header onShowCart={showCartHandler} />
      <List/>
    </>
  );
}

export default App;
