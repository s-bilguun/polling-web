import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const login = (token) => {
    // Set the token in a cookie
    Cookies.set('token', token);
    // Set the user state
    setUser({ token });
  };

  const logout = () => {
    // Remove the token from the cookie
    Cookies.remove('token');
    // Reset the user state
    setUser(null);
    // Redirect to the login page
    router.push('/login');
  };

  const checkAuth = () => {
    // Check if the token exists in the cookie
    const token = Cookies.get('token');
    if (token) {
      // Set the user state with a dummy user object
      setUser({ token, username: 'testuser' }); // Replace with your desired dummy user data
    } else {
      // Reset the user state
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth(); // Call checkAuth when the component mounts
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
