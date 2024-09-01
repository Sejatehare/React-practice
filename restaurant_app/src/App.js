import React from "react";
import Header from "./components/layout/Header";
import Meals from "./components/meals/Meals";
import Cart from "./components/Cart/Cart";

function App() {
  return (
    <React.Fragment>
      <Cart />
      <Header/>
      <main>
        <Meals />
      </main>
    </React.Fragment>
  );
}

export default App;
