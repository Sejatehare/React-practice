import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import UserProfile from "./components/Profile/UserProfile";
import ForgetPassword from "./components/Auth/ForgetPassword";
import AuthContext from "./Store/AuthContext";

const AppRoutes = () => {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {!authCtx.isLoggedIn && (
          <Route path="/auth" element={<AuthPage />} />
        )}
        {authCtx.isLoggedIn && (
          <Route path="/profile" element={<UserProfile />} />
        )}
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
