import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    userId: null,
    mobile: null,
    email: null,
    userType: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const mobile = localStorage.getItem('mobile');
    const email = localStorage.getItem('email');
    const userType = localStorage.getItem('userType');

    if (token) {
      setAuth({
        token,
        userId,
        mobile,
        email,
        userType,
        isAuthenticated: true
      });
    }
  }, []);

  const login = (token, userId, mobile, email, userType) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('mobile', mobile || '');
    localStorage.setItem('email', email || '');
    localStorage.setItem('userType', userType);

    setAuth({
      token,
      userId,
      mobile,
      email,
      userType,
      isAuthenticated: true
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('mobile');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');

    setAuth({
      token: null,
      userId: null,
      mobile: null,
      email: null,
      userType: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
