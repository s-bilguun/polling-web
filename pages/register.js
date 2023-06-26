import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import { useRouter } from 'next/router';
import { motion } from "framer-motion";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

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
        password2: password2,
      },
    })
      .then((res) => {
        console.log(res);
        setVerificationSent(true);
      })
      .catch((err) => {
        setErrorMessage('Registration failed.');
        console.log(err);
      });
  };

  const checkVerificationStatus = () => {
    axios({
      url: 'http://localhost:8001/user/checkVerification',
      method: 'POST',
      headers: {},
      data: {
        email: email,
      },
    })
      .then((res) => {
        if (res.data.verified) {
          setVerificationSent(false);
          setVerificationSuccess(true);
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    let intervalId;
    if (verificationSent) {
      intervalId = setInterval(() => {
        checkVerificationStatus();
      }, 5000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [verificationSent]);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="card">
      <Header />
      <motion.div
      initial={{ y: 25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.75,
      }}
      className="nav-bar"
      >
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
          Confirm password:
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {verificationSent && (
          <p className="verification-message">
            Verification email sent. Please check your email.
          </p>
        )}
        {verificationSuccess && (
          <p className="verification-success">Verification successful</p>
        )}
        <button type="submit">Register</button>
      </form>
      </motion.div>
    </div>
  );
};

export default Register;
