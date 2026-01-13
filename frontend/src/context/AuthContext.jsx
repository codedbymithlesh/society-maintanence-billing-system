import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')));

  const login = async (email, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password }, config);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const register = async (userData) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('http://localhost:5000/api/auth/register', userData, config);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
