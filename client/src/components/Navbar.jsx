import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTicketAlt } from "react-icons/fa";
import ThemeBtn from "./themeButton.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white-400 dark:bg-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
          <Link
            to="/"
            className="text-black dark:text-white text-2xl font-bold flex items-center gap-2"
          >
            <FaTicketAlt /> Eventora
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="text-black dark:text-gray-200 hover:text-white transition cursor-pointer"
            >
              Events
            </Link>
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-black dark:text-gray-200 hover:text-white transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-black dark:bg-gray-700 dark:hover:bg-black text-white px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
                <ThemeBtn/>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-black dark:text-gray-200 dark:hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:hover:bg-gray-800 px-4 py-2 rounded-md font-semibold transition"
                >
                  Sign Up
                </Link>
                <ThemeBtn/>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
