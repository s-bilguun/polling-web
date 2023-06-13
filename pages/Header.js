import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './headerStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [darkTheme, setDarkTheme] = useState(undefined);

  const handleToggle = (event) => {
    setDarkTheme(event.target.checked);
  };

  useEffect(() => {
    if (darkTheme !== undefined) {
      if (darkTheme) {
        // Set value of  darkmode to dark
        document.documentElement.setAttribute('data-theme', 'dark');
        window.localStorage.setItem('theme', 'dark');
      } else {
        // Set value of  darkmode to light
        document.documentElement.removeAttribute('data-theme');
        window.localStorage.setItem('theme', 'light');
      }
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
      <Link href="/" >
          <div className="logo">
          <img src="/Logo2.png" alt="Logo" />
          </div>
      </Link>
      <nav>
        <ul>
          <li>
            <div>
              <FontAwesomeIcon icon={faMoon} style={{marginRight: 12}}/>
              <FontAwesomeIcon icon={faSun}/>
              {darkTheme !== undefined && (
                <form action="#">
                  <label className="switch" style={{}}>
                    <input
                      type="checkbox"
                      checked={darkTheme}
                      onChange={handleToggle}
                    />
                    <span className="slider"></span>
                  </label>
                </form>
              )}
            </div>
          </li>
          <li>
            <Link href="/poll_create"> Create poll</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
        </ul>
      </nav>
      
    </header>
  );
};

export default Header;
