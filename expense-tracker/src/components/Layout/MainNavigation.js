import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { authActions } from "../../Store/auth-slice";
import { userActions } from "../../Store/userSlice";
import { themeActions } from "../../Store/theme-slice";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isPremium = useSelector((state) => state.auth.isPremium);
  const isDark = useSelector((state) => state.theme.isDark);
  const expenses = useSelector((state) => state.expenses.items || []);

  const logoutHandler = () => {
    localStorage.removeItem("profileCompleted")
    dispatch(authActions.logout());
    dispatch(userActions.clearUser());
    navigate("/auth");
  };

  const toggleDarkMode = () => {
    dispatch(themeActions.toggleTheme());
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "expenses.csv");
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>Expense Tracker</div>
      </Link>
      <nav>
        <ul>
          {isLoggedIn && (
            <li>
              <button onClick={toggleDarkMode}>
                {isDark ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
          )}

          {isPremium && (
              <li>
                <button onClick={downloadCSV}>Download CSV</button>
              </li>
          )}

          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}

          {isLoggedIn && (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
