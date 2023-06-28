import React, { useState, useEffect, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Header from './Header';
import axios from 'axios';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scale, setScale] = useState(1);
  const editorRef = useRef(null);
  const router = useRouter();

const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:8001/user/createUser', {
      email: email,
      username: username,
      password: password,
      password2: password2,
    });

    const userid = response.data.userid;
    if (image) {
      // Upload the cropped image
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
      const croppedImage = dataURLtoFile(canvas, `croppedImage_${Date.now()}.png`);

      const formData = new FormData();
      formData.append('image', croppedImage);

      await axios.post(`http://localhost:8001/image/registerUploadImage/${userid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          userid: userid,
        },
      });
    } else {
      // Set default profile picture if no image is selected
      await axios.post(`http://localhost:8001/image/setDefaultProfilePicture/${userid}`);
    }

    setVerificationSent(true);
  } catch (error) {
    setErrorMessage('Registration failed.');
    console.log(error);
  }
};

  

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoomChange = (e) => {
    setScale(parseFloat(e.target.value));
  };

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
      >
        <h1>Бүртгүүлэх</h1>
        <form onSubmit={handleRegister}>
          <label>
            И-мэйл:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
           Нэр:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
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
            Нууц үг (дахиад)
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </label>
          <label>
            Профайл зураг
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          {preview && (
            <div style={{ marginTop: '1rem' }}>
              <AvatarEditor
                ref={editorRef}
                image={preview}
                width={200}
                height={200}
                border={10}
                borderRadius={100}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={scale}
                rotate={0}
                onPositionChange={() => {
                  // Handle position change if needed
                }}
                style={{ borderRadius: '50%' }}
              />
            </div>
          )}
          {preview && (
            <div>
              <label>
                Томруулах:
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={scale}
                  onChange={handleZoomChange}
                />
              </label>
            </div>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {verificationSent && (
            <p className="verification-message">Баталгаажуулах и-мэйл илгээлээ. И-мэйлээ шалгана уу.</p>
          )}
          {verificationSuccess && <p className="verification-success">Баталгаажуулалт амжилттай</p>}

          <button type="submit">Бүртгүүлэх</button>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
