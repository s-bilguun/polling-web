import React, { useEffect, useLayoutEffect, useState, useContext } from 'react';
import Link from 'next/link';
import './headerStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faPlus, faUserPlus, faRightFromBracket, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from './AuthContext';

const Header = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = user !== null;

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

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
                className={`toggle-icon ${darkTheme ? 'moon' : 'sun'} icon icon-initial`}
                onClick={handleToggle}
              />
            </div>
          </li>
          <li>
            <Link href="/poll_create"><FontAwesomeIcon icon={faPlus} className="icon-initial" /> Санал асуулга үүсгэх</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <div onClick={handleDropdownToggle} className="profile-container">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Profile"
                    className="profile-picture"
                  />
                  <span>{user.username}</span>
                </div>
                {dropdownVisible && (
                  <ul className="dropdown-menu">
                    <li>
                      <Link href="/my_polls">My Polls</Link>
                    </li>
                    <li>
                      <Link href="/settings">Settings</Link>
                    </li>
                    <li>
                      <button className="logout-button" onClick={() => logout()}>
                        <FontAwesomeIcon icon={faRightFromBracket} className="icon" /> Гарах
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login"><FontAwesomeIcon icon={faRightToBracket} className="icon-initial" /> Нэвтрэх</Link>
              </li>
              <li>
                <Link href="/register"><FontAwesomeIcon icon={faUserPlus} className="icon-initial" /> Бүртгүүлэх</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
