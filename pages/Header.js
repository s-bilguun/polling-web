import React, { useEffect, useLayoutEffect, useState, useContext, useRef } from 'react';
import Link from 'next/link';
import './headerStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { faMoon, faSun, faPlus, faUserPlus, faRightFromBracket, faRightToBracket, faPollH, faCog } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from './AuthContext';

const Header = () => {
  const [darkTheme, setDarkTheme] = useState(false);
  const [clickInside, setClickInside] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileImage, setProfileImage] = useState('/placeholder.jpg'); // Set the default placeholder image path
  const dropdownRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const handleDropdownToggle = () => {
    setClickInside(true);
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
    if (isLoggedIn) {
      console.log('User object:', user);
      const fetchProfileImage = async () => {
        try {
          const response = await axios.get(`http://localhost:8001/image/displayImage/${user.id}`, {
            responseType: 'blob', // Set the response type to 'blob'
          });

          const imageUrl = URL.createObjectURL(response.data); // Create an object URL from the blob

          console.log('Fetched profile image URL:', imageUrl);
          setProfileImage(imageUrl);
        } catch (error) {
          console.log('Error fetching profile image:', error);
        }
      };

      fetchProfileImage();
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickInside) {
        setClickInside(false);
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    // Use 'click' event instead of 'mousedown'
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [clickInside]);


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
            <Link href="/poll_create">
              <FontAwesomeIcon icon={faPlus} className="icon-initial plus-icon" />
              <span className="text-hide-on-mobile">Санал асуулга үүсгэх</span>
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <div onClick={handleDropdownToggle} className="profile-container">
                  <img
                    src={profileImage} // Use the profileImage state variable as the image source
                    alt="Profile"
                    className="profile-picture"
                  />
                  {user && <span>{user.username}</span>}
                </div>
                <ul className={`dropdown-menu ${dropdownVisible ? 'dropdown-menu-visible' : ''}`} ref={dropdownRef}>
                  <li>
                    <Link href="/my_polls"><FontAwesomeIcon icon={faPollH} className="icon" /> Минийх</Link>
                  </li>
                  <li>
                    <Link href="/settings"><FontAwesomeIcon icon={faCog} className="icon" /> Тохиргоо</Link>
                  </li>
                  <li>
                    <button className="logout-button" onClick={() => logout()}>
                      <FontAwesomeIcon icon={faRightFromBracket} className="icon" /> Гарах
                    </button>
                  </li>
                </ul>
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
