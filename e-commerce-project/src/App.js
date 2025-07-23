import Header from "./Components/Header/Header";
import CartProvider from "./Components/Context/CartProvider";
import { BrowserRouter } from "react-router-dom";
import Routers from "./Components/Routers/Routers";
import Footer from "./Components/Pages/Footer";
import { AuthContextProvider } from "./Components/Context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AuthContextProvider>
          <Header></Header>
          <Routers></Routers>
          <Footer></Footer>
        </AuthContextProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
