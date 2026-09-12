import React, { useEffect, useState } from "react";
import api from "../utils/axios.js";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      setUser(data.data.user);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("token", data.data.token);

      return data.data;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (fullName, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        fullName,
        email,
        password,
      });
      setUser(data.data);
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };
  const verifyOTP = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      setUser(data.data.user);

      localStorage.setItem("user", JSON.stringify(data.data.user));
      localStorage.setItem("token", data.data.token);

      return data.data;
    } catch (error) {
      console.error("OTP Verification failed", error);
      throw error;
    }
  };
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, verifyOTP, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
