import React, { useState, useContext } from "react";
import Header from "./Header";
import axios from "axios";
import { useRouter } from "next/router";
import { AuthContext } from './AuthContext'; 
import { motion } from "framer-motion";
import { toast } from 'react-toastify';
import videoBg from '../pages/video/background.mp4'

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
        fetchLoggedUsers();
        login(res.data.token); // call the login function from AuthContext
        router.push("/");
        console.log(res);
        toast.success('Амжилттай нэвтэрлээ 😎', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      })
      .catch((err) => {
        setErrorMessage("И-мэйл болон нууц үгээ шалгана уу!");
        toast.error('И-мэйл болон нууц үгээ шалгана уу!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log(err);
      });

    console.log("Login submitted:", { email, password });
    setEmail("");
    setPassword("");
  };

  const fetchLoggedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8001/auth/loggedUsers');
      if (response.status >= 200 && response.status < 300) {
        const data = response.data;
        console.log('Fetched logged user list:', data);
        setUserList(data);
      } else {
        console.error('Failed to fetch logged user list');
      }
    } catch (error) {
      console.error('Error fetching logged user list:', error);
    }
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
      <h1>Нэвтрэх</h1>
      <form onSubmit={handleLogin}>
        <label>
          И-майл:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button onClick={handleLogin} type="submit">
          Нэвтрэх
        </button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>
      </motion.div>
    </div>
  );
};

export default Login;
