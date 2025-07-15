import Header from "./Components/Header/Header";
import CartProvider from "./Components/Context/CartProvider";
import { BrowserRouter } from "react-router-dom";
import Routers from "./Components/Routers/Routers";
import Footer from "./Components/Pages/Footer";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header></Header>
        <Routers></Routers>
        <Footer></Footer>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
