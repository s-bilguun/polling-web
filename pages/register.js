import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State variable for error message

  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();

    axios({
      url: 'http://localhost:8001/user/createUser',
      method: 'POST',
      headers: {},
      data: {
        email: email,
        username: username,
        password: password,
        birthdate: birthdate,
      },
    })
      .then((res) => {
        console.log(res);
        router.push('/');
      })
      .catch((err) => {
        setErrorMessage('Registration failed.'); // Set error message
        console.log(err);
      });

    console.log('Registration submitted:', {
      email,
      username,
      password,
      birthdate,
    });

    setEmail('');
    setUsername('');
    setPassword('');
    setBirthdate('');
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="card">
      <Header />
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Birthday:
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </label>
        <button type="submit">Register</button>
        {errorMessage && <p>{errorMessage}</p>} {/* Render error message */}
      </form>
    </div>
  );
};

export default Register;
