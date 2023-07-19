import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Header from './Header';
import axios from 'axios';
import moment from 'moment';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AddPoll = () => {
  const { user, setUser } = useContext(AuthContext);

  const [question, setQuestion] = useState('');
  const [startDateTime, setStartDateTime] = useState(moment().format('YYYY-MM-DDTHH:mm'));
  const [endDateTime, setEndDateTime] = useState('');
  const [choices, setChoices] = useState(['', '']);
  const [pollType, setPollType] = useState('original');
  const [visible, setVisible] = useState(false);

  const handleAddChoice = () => {
    setChoices([...choices, '']);
  };

  const handleDeleteChoice = (index) => {
    const updatedChoices = [...choices];
    updatedChoices.splice(index, 1);
    setChoices(updatedChoices);
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  const handleToggle = () => {
    setPollType(pollType === 'original' ? 'opinion' : 'original');
  };

  const handleToggleVisibility = () => {
    setVisible(!visible);
  };

  const handlePollSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is logged in
    if (!user) {
      console.log('You are not logged in');
      return;
    }

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

  const router = useRouter();
  return (
    <>
      <Header />
      
      <div className="card">
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.75,
          }}
          className="nav-bar"
        >
          {user ? (
            <>
              <div className="custom-checkbox">
                <input
                  id="status"
                  type="checkbox"
                  name="status"
                  checked={pollType === 'opinion'}
                  onChange={handleToggle}
                />
                <label htmlFor="status">
                  <div
                    className="status-switch"
                    data-unchecked="Сонголттой"
                    data-checked="Бичих"
                  ></div>
                </label>
              </div>
              <form onSubmit={handlePollSubmit}>
                <label>
                  Асуулт:
                  <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
                </label>
                <label>
                  Эхлэх өдөр & цаг:
                  <input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Дуусах өдөр & цаг:
                  <input
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                    required
                  />
                </label>

                <div className="toggle-container">
                  <div className="toggle-label">Оролцогчдын харагдац:</div>
                  <div onClick={handleToggleVisibility}>
                    <FontAwesomeIcon icon={visible ? faToggleOn : faToggleOff} className="toggle-icon" />
                  </div>
                </div>

                {pollType === 'original' ? (
                  <div>
                    <label>
                      Сонголтууд:
                      {choices.map((choice, index) => (
                        <div key={index} className="input-inline">
                          <input
                            type="text"
                            value={choice}
                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                            required
                          />
                          <button onClick={() => handleDeleteChoice(index)}>
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </div>
                      ))}
                    </label>
                    <button type="button" onClick={handleAddChoice}>
                      Сонголт нэмэх
                    </button>
                  </div>
                ) : null}

                <div style={{ marginTop: '1rem' }}>
                  <button type="submit">Үүсгэх</button>
                </div>
              </form>
            </>
          ) : (
            <p>Санал асуулга үүсгэхийн тулд нэвтэрсэн байх хэрэгтэй!</p>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default AddPoll;
