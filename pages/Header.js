import React, { useEffect, useLayoutEffect, useState } from 'react';
import Link from 'next/link';
import './headerStyles.css';
import dropdownContent from './dropdownContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faHistory } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [darkTheme, setDarkTheme] = useState(false);

  const handleToggle = () => {
    if (typeof window !== 'undefined') {
      setDarkTheme(!darkTheme);
      if (darkTheme) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    }
  };


  useLayoutEffect(() => {
    // Make icons visible after mounting
    const icons = document.querySelectorAll('.icon-initial');
    icons.forEach((icon) => {
      icon.style.opacity = '1';
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark') {
        setDarkTheme(true);
      } else {
        setDarkTheme(false);
      }
    }
  }, []);

  return (
    <header>
      <Link href="/">
        <div className="Name text-4xl font-serif">
          ProjectPRD
        </div>
      </Link>

      <nav>
      <div className="toggle-container">
              <FontAwesomeIcon
                icon={darkTheme ? faMoon : faSun}
                className={`toggle-icon ${darkTheme ? 'moon' : 'sun'} icon icon-initial`}
                onClick={handleToggle}
              />
            </div>
      </nav>
    </header>
  );
};

export default Header;
