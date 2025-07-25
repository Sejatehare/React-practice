// import { Routes, Route } from "react-router-dom";
// import Layout from "./components/Layout/Layout";
// import UserProfile from "./components/Profile/UserProfile";
// import AuthPage from "./pages/AuthPage";
// import HomePage from "./pages/HomePage";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./Store/AuthContext";
import AppRoutes from "./AppRoutes"; // Create a new component

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
