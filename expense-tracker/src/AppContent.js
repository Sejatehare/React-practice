import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./Store/AuthContext";
import { ExpenseContextProvider } from "./Store/ExpenseContext";
import AppRoutes from "./AppRoutes";

function AppContent() {
  const isDarkMode = useSelector((state) => state.theme.isDark);

  return (
    <div className={`${isDarkMode ? "darkTheme" : ""}`}>
      <AuthContextProvider>
        <ExpenseContextProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ExpenseContextProvider>
      </AuthContextProvider>
    </div>
  );
}

export default AppContent;
