import React, { useContext } from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './headerStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from './AuthContext';

const Header = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const isLoggedIn = user !== null;

  const handleToggle = () => {
    setDarkTheme(!darkTheme);
  };

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setDarkTheme(false);
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      window.localStorage.setItem('theme', 'light');
    }
  }, [darkTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = root.style.getPropertyValue(
      '--initial-color-mode'
    );
    // Set initial darkmode to light
    setDarkTheme(initialColorValue === 'dark');
  }, []);

  return (
    <header>
      <Link href="/">
        <div className="logo">
          <img src="/Logo2.png" alt="Logo" />
        </div>
      </Link>
      <nav>
        <ul>
          <li>
            <div className="toggle-container">
              <FontAwesomeIcon
                icon={darkTheme ? faMoon : faSun}
                className={`toggle-icon ${darkTheme ? 'moon' : 'sun'}`}
                onClick={handleToggle}
              />
            </div>
          </li>
          <li>
            <Link href="/poll_create">Create poll</Link>
          </li>
          {isLoggedIn ? (
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
