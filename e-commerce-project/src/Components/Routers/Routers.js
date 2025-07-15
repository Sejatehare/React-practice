import { Route, Routes } from "react-router-dom";
import ProductList from "../Products/ProductList";
import About from "../Pages/About";

const Routers = () => {
    return <>
        <Routes>
            <Route path="/" element={<ProductList/>}></Route>
            <Route path="/store" element={<ProductList/>}></Route>
            <Route path="/about" element={<About/>}></Route>
        </Routes>
    </>
}

export default Routers;