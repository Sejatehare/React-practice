import { Route, Routes, Navigate } from "react-router-dom";
import ProductList from "../Products/ProductList";
import About from "../Pages/About";
import Home from "../Pages/Home";
import ContactUs from "../Pages/ContactUs";
import ProductPage from "../Products/ProductPage";
import AuthForm from "../Auth/AuthForm";
import { useContext } from "react";
import AuthContext from "../Context/AuthContext";

export const routePath = {
    Home: "/",
    Store: "/store",
    About: "/about",
    ContactUs: "/contact-us",
    ProductPage: "/store/product",
    Login: "/login",
};

const Routers = () => {

    const authCtx = useContext(AuthContext)

    return <>
        <Routes>
            <Route path={routePath.Home} element={<Home />} />
            <Route path={routePath.Default} element={<Home />} />
            <Route path={routePath.Store} element={
                authCtx.isLoggedIn ? (
                <ProductList />
                ) : (
                <Navigate to={routePath.Login} />
                )
            }/>
            <Route path={routePath.ProductPage} element={<ProductPage />} />
            <Route path={routePath.About} element={<About />} />
            <Route path={routePath.Login} element={<AuthForm/>}/>
            <Route path={routePath.ContactUs} element={<ContactUs />} />
        </Routes>
    </>
}

export default Routers;