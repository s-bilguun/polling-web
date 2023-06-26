import React, { useState, useContext } from "react";
import Header from "./Header";
import axios from "axios";
import { useRouter } from "next/router";
import { AuthContext } from './AuthContext'; 
import { motion } from "framer-motion";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State variable for error message
  const { login } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    axios({
      url: "http://localhost:8001/auth/login",
      method: "POST",
      headers: {},
      data: {
        email: email,
        password: password,
      },
    })
      .then((res) => {
        console.log("Connected to pollweb 2023");
        login(res.data.token); // call the login function from AuthContext
        router.push("/");
        console.log(res);
      })
      .catch((err) => {
        setErrorMessage("Login failed. Please check email or password"); // Set error message
        console.log(err);
      });

    console.log("Login submitted:", { email, password });
    setEmail("");
    setPassword("");
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
        <button onClick={handleLogin} type="submit">
          Login
        </button>
        {errorMessage && <p>{errorMessage}</p>} {/* Render error message */}
      </form>
      </motion.div>
    </div>
  );
};

export default Login;
