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
