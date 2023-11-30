// Page.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import HistoryComponent from './dropdownContent';
import { faUser ,} from '@fortawesome/free-solid-svg-icons';
import {  faHistory   } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DropdownSort from './DropdownSort';


const Page = () => {
  const [projectname, setProjectName] = useState([]);
  const [userRequirment, setUserRequirement] = useState([]);
  const [compInfo, setCompInfo] = useState([]);

  const [showHistory, setShowHistory] = useState(false);
  

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    // Format the date and time strings
    const startDateTimeFormatted = `${startDateTime}:00`;
    const endDateTimeFormatted = `${endDateTime}:00`;

    try {
      // Submit the poll data to the backend
      const response = await axios.post(
        'http://localhost:8001/poll/createPoll',
        {
          question: question,
          startdate: startDateTimeFormatted,
          expiredate: endDateTimeFormatted,
          answer: pollType === 'opinion' ? null : choices,
          type: pollType,
          visibility: visible,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // Reset the form
      setQuestion('');
      setStartDateTime('');
      setEndDateTime('');
      setChoices(['', '']);
      setPollType('original');
      setVisible(false);

      // Go back to the index page or any other desired page
      router.push('/');
      toast.success('Санал асуулга амжилттай үүслээ 😎', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    } catch (error) {
      console.log('Error submitting poll:', error);
    }
  };
  return (
    <div>
      <Header />
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.75,
        }}
      >
       <form 
      //  onSubmit={handleGenerate}
       >
                <label>
                  Системийн нэр: 
                  <input type="text" value={projectname} onChange={(e) => setProjectName(e.target.value)} required />
                </label>
                <label>
                  Шаардлага: Энд асуудлыг дэлгэрэнгүйгээр бичиж оруулна. 
                  <input type="text" value={userRequirment} onChange={(e) => setUserRequirement(e.target.value)} required />
                </label>
                <label>
                  Компаний үйл ажиллагаа: Энд ашиглах компаний мэдээллийг оруулах бөгөөд энэ хэсгийг заавал бөглөх шаардлагагүй
                  <input type="text" value={compInfo} onChange={(e) => setCompInfo(e.target.value)} required />
                </label>

                <div style={{ marginTop: '1rem' }}>
                  <button type="submit">Үүсгэх</button>
                </div>
              </form>
              
              {/* History button and dropdown outside the form */}
      <div style={{ position: 'fixed', top: '100px', left: '10px', zIndex: 999 }}>
        <button onClick={handleToggleHistory} className="history-button">
          <FontAwesomeIcon icon={faHistory } />
        </button>
        {showHistory && <HistoryComponent />}
      </div>

      </motion.div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Page;
