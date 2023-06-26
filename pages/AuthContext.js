import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // New state variable


  const login = async (token) => {
    // Set the token in a cookie
    Cookies.set('token', token);
    // Decode the token to get the user ID
    const decodedToken = jwt_decode(token);
    console.log('Decoded token:', decodedToken);
  
    if (decodedToken.userid) {
      // Fetch user details using the user ID
      const userDetails = await fetchUserDetails(decodedToken.userid);
      
      if (userDetails) {
        setUser({ token, ...userDetails, username: userDetails.username });
      } else {
        setUser(null);
      }
    } else {
      console.error('Invalid user ID');
      setUser(null);
    }
  };

  const logout = () => {
    // Remove the token from the cookie
    Cookies.remove('token');
    // Reset the user state
    setUser(null);
    // Redirect to the login page
    router.push('/login');
  };
  const fetchUserDetails = async (id) => {
    try {
      if (id) {
        const response = await axios.get(`http://localhost:8001/user/${id}`);
        const userData = response.data;
        console.log('User data:', userData);
        return userData.user; // Return the nested user object
      } else {
        console.error('Invalid user ID');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };
  
  
  
  
  
  const checkAuth = async () => {
    setLoading(true);
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      const userDetails = await fetchUserDetails(decodedToken.userid);
      if (userDetails) {
        setUser({ token, ...userDetails, username: userDetails.username });
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
    setAuthChecked(true);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (!authChecked) {
    return null; // Or any loading state component
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        checkAuth,
      }}
    >
      {!loading && children} {/* Only render children when not loading */}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
