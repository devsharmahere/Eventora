import useTheme from "../context/ThemeContext.js";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeBtn = () => {
  const { theme, lightTheme, darkTheme } = useTheme();

  const isDark = theme === "dark";

  const toggleTheme = () => {
    if (isDark) {
      lightTheme();
    } else {
      darkTheme();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className={`flex items-center gap-3 px-3 py-2 rounded-full transition-colors duration-300 ${
        isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Toggle Track */}
      <span
        className={`relative flex items-center w-16 h-8 rounded-full p-1 transition-colors duration-300 ${
          isDark ? "bg-indigo-700" : "bg-blue-500"
        }`}
      >
        {/* Sliding Circle */}
        <span
          className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-500 ease-in-out ${
            isDark ? "translate-x-8" : "translate-x-0"
          }`}
        >
          {/* Sun Icon */}
          <FaSun
            className={`absolute text-amber-500 transition-all duration-500 ${
              isDark
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
            size={14}
          />

          {/* Moon Icon */}
          <FaMoon
            className={`absolute text-indigo-600 transition-all duration-500 ${
              isDark
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            }`}
            size={13}
          />
        </span>
      </span>
    </button>
  );
};

export default ThemeBtn;
