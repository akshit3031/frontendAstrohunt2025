import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {VERIFY_USER,LOGIN,LOGOUT} from "../constants.js"

// Attach Authorization header from localStorage token for all requests
axios.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!cfg.headers) cfg.headers = {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
}, (err) => Promise.reject(err));

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check auth status on mount
  useEffect(() => {
    console.log("Checking auth status");
    checkAuth();
  }, []);

  // Helper to detect expired token without calling backend
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) return true;
      const now = Math.floor(Date.now() / 1000);
      return payload.exp <= now;
    } catch (e) {
      return true;
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || isTokenExpired(token)) {
        // token missing or expired — clear and skip verify call to avoid backend jwt expired logs
        localStorage.removeItem('token');
        setUser(null);
        setLoading(false);
        return;
      }
      // Token looks valid locally, verify with backend
      const response = await axios.get(VERIFY_USER);
      console.log("Response from checkAuth", response.data);
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post(
      LOGIN,
      { email, password }
    );
    console.log(response.data);
    // Store access token in localStorage
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
  await axios.post(LOGOUT);
  // Clear token from localStorage
  localStorage.removeItem('token');
  // Clear stored email (used during signup/OTP flow)
  localStorage.removeItem('email');
  setUser(null);
  navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading ,setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);