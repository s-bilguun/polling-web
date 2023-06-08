  import React, { useState } from 'react';
  import Header from './Header';

  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
      e.preventDefault();
      //TODO: Login Logic:


      console.log('Login submitted:', { email, password });
      // Reset the form
      setEmail('');
      setPassword('');
    };

    return (
      <div class="card">
         <Header/>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };

  export default Login;