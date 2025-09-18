import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import AuthForm from "./components/Auth/AuthForm";
import ForgetPassword from "./components/Auth/ForgetPassword";
import ProfileView from "./components/Profile/ProfileView";
import CompleteProfilePage from "./pages/CompleteProfilePage";

const AppRoutes = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/auth"
          element={!isLoggedIn ? <AuthForm /> : <Navigate to="/" />}
        />
        <Route
          path="/complete-profile"
          element={isLoggedIn ? <CompleteProfilePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <ProfileView /> : <Navigate to="/auth" />}
        />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
