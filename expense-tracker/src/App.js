import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter} from "react-router-dom";
import { AuthContextProvider } from "./Store/AuthContext";
import AuthContext from "./Store/AuthContext";
import { useContext } from "react";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {!authCtx.isLoggedIn && (
              <Route path="/auth" element={<AuthPage />} />
            )}
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;