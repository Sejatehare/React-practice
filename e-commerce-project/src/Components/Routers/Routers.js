import { Route, Routes } from "react-router-dom";
import ProductList from "../Products/ProductList";
import About from "../Pages/About";
import Home from "../Pages/Home";
import ContactUs from "../Pages/ContactUs";

const Routers = () => {
    return <>
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/store" element={<ProductList/>}></Route>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/contact-us" element={<ContactUs/>}></Route>
        </Routes>
    </>
}

export default Routers;