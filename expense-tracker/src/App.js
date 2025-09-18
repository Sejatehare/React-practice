import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import AppRoutes from "./AppRoutes";
import "./App.css";

function App() {
  const isDarkMode = useSelector((state) => state.theme.isDark);

  return (
    <div className={`${isDarkMode ? "darkTheme" : "lightTheme"}`}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
