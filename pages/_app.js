import React, { useState, useEffect } from 'react';
import '../src/app/custom-styles.css';
import './themescript.js';
import { Inter } from 'next/font/google';
import { AuthProvider } from './AuthContext';
import LoadingScreen from './loadingScreen';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsContentVisible(true);
    }, 500); // Adjust the loading time as needed (in milliseconds)

    return () => clearTimeout(timer);
  }, []);

  const router = useRouter();

  return (
    <AuthProvider>
      {isLoading ? <LoadingScreen /> : null}
      {isContentVisible ? <Component {...pageProps} /> : null}
    </AuthProvider>
    
  );
}

export default MyApp;
