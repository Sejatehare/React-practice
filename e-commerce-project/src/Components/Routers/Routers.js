import { Route, Routes } from "react-router-dom";
import ProductList from "../Products/ProductList";
import About from "../Pages/About";
import Home from "../Pages/Home";
import ContactUs from "../Pages/ContactUs";
import ProductPage from "../Products/ProductPage";

export const routePath = {
    Home: "/",
    Store: "/store",
    About: "/about",
    ContactUs: "/contact-us",
    ProductPage: "/store/product",
};

const Routers = () => {

    return <>
        <Routes>
            <Route path={routePath.Home} element={<Home />} />
            <Route path={routePath.Store} element={<ProductList />} />
            <Route path={routePath.ProductPage} element={<ProductPage />} />
            <Route path={routePath.About} element={<About />} />
            <Route path={routePath.ContactUs} element={<ContactUs />} />
        </Routes>
    </>
}

export default Routers;