import React, { useState, useEffect } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: Add your registration logic here

    console.log('Registration submitted:', { email, password, birthday });
    // Reset the form
    setEmail('');
    setPassword('');
    setBirthday('');
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
    <div class="card">
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
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </label>
        <button type="submit">Register</button>
      </form>
      {/* <button className="toggle-btn" onClick={handleDarkModeToggle}>
        {darkMode ? (
          <img src="/light-logo.svg" alt="Light Mode" />
        ) : (
          <img src="/dark-logo.svg" alt="Dark Mode" />
        )}
      </button> */}
    </div>
  );
};

export default Register;
