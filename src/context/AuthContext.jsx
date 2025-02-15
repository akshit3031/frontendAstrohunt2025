import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {VERIFY_USER,LOGIN,LOGOUT} from "../constants.js"

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

  const checkAuth = async () => {
    try {
      console.log("ACCESS TOKEN", document.cookie.accessToken);
      console.log("REFRESH TOKEN", document.cookie.refreshToken);
      const response = await axios.get(VERIFY_USER, {
        withCredentials: true
      });

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
      { email, password },
      { withCredentials: true }
    );
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await axios.post(LOGOUT, {}, { withCredentials: true });
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