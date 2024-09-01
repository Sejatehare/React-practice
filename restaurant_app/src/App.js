import React from "react";
import Header from "./components/layout/Header";
import Meals from "./components/meals/Meals";

function App() {
  return (
    <div>
      <Header/>
      <main>
        <Meals />
      </main>
    </div>
  );
}

export default App;
