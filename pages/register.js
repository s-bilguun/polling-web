import React, { useState, useEffect } from 'react';
import Header from './Header';
import axios from 'axios';
import { useRouter } from 'next/router';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== retypePassword) {
      setErrorMessage('Нууц үг зөрж байна!');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('password', password);
    formData.append('profilePicture', profilePicture);

    axios({
      url: 'http://localhost:8001/user/createUser',
      method: 'POST',
      headers: {},
      data: formData,
    })
      .then((res) => {
        console.log(res);
        router.push('/');
      })
      .catch((err) => {
        setErrorMessage('Registration failed.');
        console.log(err);
      });

    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
    setRetypePassword('');
    setProfilePicture(null);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
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
      <h1>Бүртгүүлэх</h1>
      <form onSubmit={handleRegister}>
        <label>
          Цахим хаяг:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
         Овог:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        <label>
          Нэр:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
 
        <label>
          Нууц үг:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Нууц үг лавтан бичнэ үү:
          <input
            type="password"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            required
          />
        </label>
        <label>
          Профайл зураг:
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
        </label>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Бүртгүүлэх</button>
      </form>
    </div>
  );
};

export default Register;
