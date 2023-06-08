import React from 'react';
import Link from 'next/link';
import './headerStyles.css';

const Header = () => {
  return (
    <header>
      <Link href="/">
          <div className="logo">
          <img src="/logo.png" alt="Logo" />
          </div>
   
      </Link>
      <nav>
        <ul>
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
