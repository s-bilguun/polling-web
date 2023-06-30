import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Header from './Header';
import { motion } from 'framer-motion';
import AvatarEditor from 'react-avatar-editor';

const Settings = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scale, setScale] = useState(1);
  const editorRef = useRef(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentProfilePicture, setCurrentProfilePicture] = useState('');
  useEffect(() => {
    const fetchCurrentProfilePicture = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/image/${user.username}/getOwnPro`, {
          responseType: 'blob',
        });
        if (response.status === 200) {
          const imageURL = URL.createObjectURL(response.data);
          setCurrentProfilePicture(imageURL);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentProfilePicture();
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file);
        setPreview(reader.result); // Update the preview with the reader's result
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoomChange = (e) => {
    setScale(parseFloat(e.target.value));
  };

  const handleUpdateProfilePicture = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (image || currentProfilePicture) {
        let canvas;
        if (image) {
          // If a new image file is selected, use that for cropping
          canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
        } else {
          // If no new image file is selected, use the current profile picture for cropping
          canvas = editorRef.current.getImage().toDataURL();
        }
        const croppedImage = dataURLtoFile(canvas, `croppedImage_${Date.now()}.png`);

        const formData = new FormData();
        formData.append('image', croppedImage);

        await axios.put('http://localhost:8001/image/updateImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Update the preview state with the cropped image URL
        setPreview(canvas);

        // Update the user's image in the context
        updateUser({ ...user, image: canvas });

        setSuccessMessage('Зураг амжилттай солигдлоо.');
      } else {
        setErrorMessage('Зураг оруулаагүй байна!');
      }
    } catch (error) {
      setErrorMessage('Зураг солих бүтэлгүйтлээ');
      console.log(error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      setErrorMessage('Шинэ нууц үг болон шинэ нууц үг давтан ижил биш байна.');
      return;
    }

    try {
      await axios.put(
        'http://localhost:8001/auth/changePassword',
        {
          oldPass: oldPassword,
          newPass: newPassword,
          newPass2: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccessMessage('Амжилттай солигдлоо');
    } catch (error) {
      setErrorMessage('Нууц үг солих бүтэлгүйтлээ');
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

  return (
    <div className="card-container">
      <div className="card">
        <Header />
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.75,
          }}
        >
          <h1>Тохиргоо</h1>

          <form onSubmit={handleUpdateProfilePicture}>
            <label>
              Профайл зураг:
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            {(preview || currentProfilePicture) && (
              <div style={{ marginTop: '1rem' }}>
                <AvatarEditor
                  ref={editorRef}
                  image={preview || currentProfilePicture} // Use the preview image if available, or fall back to the current profile picture
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
            {(preview || currentProfilePicture) && (
              <div>
                <label>
                  Zoom:
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
            <button type="submit">Зургаа шинэчлэх</button>
          </form>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </motion.div>
      </div>

      <div className="card2">
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.75,
          }}
        >
          <h1>Нууц үг солих</h1>

          <form onSubmit={handleUpdatePassword}>
            <label>
              Хуучин нууц үг:
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </label>
            <label>
              Шинэ нууц үг:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
            <label>
              Шинэ нууц үг дахин бичнэ үү:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <button type="submit">Нууц үг солих</button>
          </form>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
