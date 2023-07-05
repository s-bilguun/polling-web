import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../Header';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments, faPlus } from '@fortawesome/free-solid-svg-icons';
import Profile from '../Profile';
import { motion } from "framer-motion";

const formatDateTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);
  const date = dateTime.toLocaleDateString('en-US');
  const time = dateTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} ${time}`;
};

const Poll = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState('');
  const [poll, setPoll] = useState({
    // Other poll fields...
    startdate: null,
    expiredate: null,
  });
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [newAnswer, setNewAnswer] = useState('');
  const [usernames, setUsernames] = useState({});
  const [userImages, setUserImages] = useState({});
  const [attendance, setAttendance] = useState([]);
  let i = 0;
  const [sum, setSum] = useState(0);
  let safeUsernames = Array.isArray(usernames) ? usernames : [];

  const handleNewAnswerChange = (e) => {
    setNewAnswer(e.target.value);
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8001/poll/getPoll/${id}`)
        .then(res => {
          setPoll(res.data);
          console.log(res.data);
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error.response.data.error);
        })
    }
    const fetchAnswer = async () => {
      try {
        const response = await fetch(`http://localhost:8001/answers/${id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setAnswers(data);
        } else {
          console.error('Failed to fetch Poll answer');
        }
      } catch (error) {
        console.error('Error fetching poll answer:', error);
      }
    };

    const fetchAttendance = async () => {
      try {
        const response = await fetch(`http://localhost:8001/attendance/${id}/getOwnAttendance`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setSelectedAnswer(data.attend.answerid || ''); // Set the selected answer from the attendance data
          console.log(data.attend.answerid);
          setHasSubmitted(data.attend.answerid !== null);
        } else {
          console.error('Failed to fetch poll attendance');
        }
      } catch (error) {
        console.error('Error fetching poll attendance:', error);
      }
    };

    const fetchComment = async () => {
      const response = await fetch(`http://localhost:8001/comment/${id}`);
      if (response.ok) {
        const data = await response.json();

        // Fetch profile image for each comment username
        const commentsWithProfileImages = await Promise.all(
          data.map(async (comment) => {
            const profileImage = await fetchProfileImageByUsername(comment.username);
            return { ...comment, profileImage };
          })
        );

        setComments(commentsWithProfileImages);
      } else {
        console.error('Failed to fetch comments');
      }
    }

    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/image/displayWithUsername/${poll.username}`, {
          responseType: 'blob', // Set the response type to 'blob'
        });

        const imageUrl = URL.createObjectURL(response.data); // Create an object URL from the blob


        setProfileImage(imageUrl);
      } catch (error) {
        console.log('Error fetching profile image:', error);
      }
    };

    const fetchOpinionAttendancy = async () => {
      try {
        const response = await axios.get(`http://localhost:8001/attendance/${id}/getOpinionAttendancy`);
        if (response.status >= 200 && response.status < 300) {
          const data = response.data;
          setUsernames(data);
          console.log('a = ', data);
        } else {
          console.error('Failed to fetch opinion attendance');
        }
      } catch (error) {
        console.error('Error fetching opinion attendance:', error);
      }
    };

    const fetchAttendanceResult = async () => {
      const response = await fetch(`http://localhost:8001/attendance/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
        const total = data.reduce((accumulator, item) => accumulator + item, 0);
        setSum(total);
      } else {
        console.error("failed to fetch attendance");
      }
    };


    // Inside the useEffect hook, update the fetchOpinionAttendancy cal`l
    fetchOpinionAttendancy();
    fetchProfileImage();
    fetchAnswer();
    fetchComment();
    fetchAttendance();
    fetchAttendanceResult();
    const interval = setInterval(() => {
      fetchOpinionAttendancy();
      fetchProfileImage();
      fetchAnswer();
      fetchComment();
      fetchAttendanceResult();

    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [id, poll.username]);

  useEffect(() => {
    // Fetch initial profile images
    const fetchInitialProfileImages = async () => {
      const newImages = {};
      await Promise.all(
        safeUsernames.map(async (item) => {
          const { answerid, usernames } = item;
          await Promise.all(
            usernames.map(async (username) => {
              if (!userImages[username]) {
                const image = await fetchProfileImageByUsername(username);
                newImages[username] = image;
              } else {
                newImages[username] = userImages[username];
              }
            })
          );
        })
      );
      setUserImages((prevUserImages) => ({ ...prevUserImages, ...newImages }));
    };

    fetchInitialProfileImages();
  }, [safeUsernames]);




  // replace with comment data logic
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [comment, setComment] = useState('');


  const handleAnswerSelection = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleNewAnswerSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8001/answers/createAnswer/opinion/${id}`,
        { answer: newAnswer },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Handle the response and update the answers state accordingly
      const createdAnswer = response.data.answer; // Get the answer from the response data
      setAnswers((prevAnswers) => [...prevAnswers, createdAnswer]);
      setSelectedAnswer(createdAnswer.id); // Set selectedAnswer to the new answer's id
      setNewAnswer(''); // Clear the input field

      // Update the attendance with the new answer
      const updateResponse = await axios.put(
        `http://localhost:8001/attendance/${id}/updatePollAttendance/${createdAnswer.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Handle update response
      if (updateResponse.status === 200) {
        setHasSubmitted(true); // Set hasSubmitted to true
      }
    } catch (error) {
      console.error('Error creating answer:', error);
      // Handle error message or display error to the user
    }
  };

  const handleAnswerUpdate = async (e) => {
    e.preventDefault();
    // setSelectedAnswer()
    try {
      const response = await axios.put(
        `http://localhost:8001/attendance/${id}/updatePollAttendance/${selectedAnswer}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        // setSelectedAnswer('');
        setErrorMessage('Сонголт амжилттай шинэчлэгдлээ');
        setHasSubmitted(true); // Set hasSubmitted to true
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setErrorMessage('You have not submitted any answer yet.');
      } else {
        setErrorMessage('An error occurred while updating the answer.');
      }
    }
  };


  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const startDate = new Date(poll.startdate);
    const expireDate = new Date(poll.expiredate);

    if (now < startDate) {
      setErrorMessage('The poll has not started yet.');
      return;
    }

    if (now > expireDate) {
      setErrorMessage('The poll has expired.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8001/attendance/${id}/createPollAttendance/${selectedAnswer}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setErrorMessage('Амжилттай сонгогдлоо');
      setHasSubmitted(true); // Set hasSubmitted to true

      // setSelectedAnswer('');
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setErrorMessage('');
      } else {
        setErrorMessage('');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios({
        url: `http://localhost:8001/comment/createComment/${id}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        data: {
          comment: comment,
        },
      });

      const newComment = response.data.commento;

      // Fetch the profile image for the new comment's username
      const profileImage = await fetchProfileImageByUsername(newComment.username);

      // Add the profile image to the new comment object
      const commentWithProfileImage = { ...newComment, profileImage };

      // Add the newly created comment to the beginning of the comments state
      setComments((prevComments) => [commentWithProfileImage, ...prevComments]);

      // Clear the comment input field
      setComment('');
    } catch (err) {
      // Set error message or handle error
      console.log(err);
    }
  };

  const handleViewResults = () => {
    router.push(`/poll/${id}/result`);
  };
  const handleShowUsernames = async (answerId, event) => {
    event.preventDefault();
    const newImages = { ...userImages };
    const usernamesToFetch = usernames.find((item) => item.answerid === answerId)?.usernames;
    for (const username of usernamesToFetch) {
      if (!newImages[username]) {
        newImages[username] = await fetchProfileImageByUsername(username);
      }
    }
    setUserImages(newImages);
    const usernameList = document.getElementById(`username-list-${answerId}`);
    const overlay = document.getElementById('overlay');
    if (usernameList && overlay) {
      usernameList.classList.toggle('visible');
      overlay.classList.toggle('visible');
    }
  };


  const handleCloseUsernames = (event, answerId) => {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Prevent event propagation

    const usernameList = document.getElementById(`username-list-${answerId}`);
    const overlay = document.getElementById('overlay');

    if (usernameList && overlay) {
      usernameList.classList.remove('visible');
      overlay.classList.remove('visible');
    }
  };
  const fetchProfileImageByUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8001/image/displayWithUsername/${username}`, {

        responseType: 'blob',
      });
      console.log('comment', comment.username);
      const imageUrl = URL.createObjectURL(response.data);
      console.log('Fetched profile image URL:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.log('Error fetching profile image:', error);
      return null;
    }
  };




  return (
    poll ?
      <div className="container">
        <Header />
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.75,
          }}
          className="nav-bar"
        >
          {/* <h1 className="text-3xl font-bold mb-4">Poll Details</h1> */}
          <form className="detial-info" onSubmit={hasSubmitted ? handleAnswerUpdate : handleAnswerSubmit}>
            <div className="mb-4">
              {/* Display the user's profile image */}
              <div className="profile-container">
                {profileImage ? (
                  <div className="profile-pic">
                    <img src={profileImage} alt="User profile" />
                  </div>
                ) : (
                  <FontAwesomeIcon icon={faUser} className="fa-user-icon" />
                )}
                <div className="profile-name">{poll.username}</div>
              </div>
              <h2 className="text-xl font-bold mb-2 poll-question">{poll.question}</h2>


              {answers.map((answer, index) => (
                <div key={answer.id} className="poll-answer">
                  <label>
                    <input
                      type="radio"
                      name={poll.id}
                      value={answer.answername}
                      checked={selectedAnswer === answer.id}
                      onChange={() => handleAnswerSelection(answer.id)}
                    />
                    <div className="poll__option">
                      <div className="poll__option-info">
                        <div>
                          <p className="poll__label">{answer.answername}</p>
                        </div>
                        <div
                          className="clickable-area"
                          onClick={(event) => handleShowUsernames(answer.id, event)}
                        >
                          {poll.visibility && safeUsernames.find(item => item.answerid === answer.id)?.usernames.length > 0 && (
                            <div className="profile-pics">
                              {safeUsernames.find(item => item.answerid === answer.id)?.usernames.slice(0, 4).map((username) => (
                                <div className="username-row">
                                  <img src={userImages[username]} alt={username} className="profile-pic" />
                                </div>
                              ))}
                              {safeUsernames.find(item => item.answerid === answer.id)?.usernames.length > 4 && (
                                <div className="username-row">
                                  <p className="more-profile-pics">...</p>
                                </div>
                              )}
                            </div>
                          )}

                          <div>
                            <p className="poll__percentage">
                              {attendance[i++]}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className="progress-bar"
                        style={{
                          backgroundSize: `${(attendance[index] / sum) * 100}% 100%`
                        }}
                      ></div>
                    </div>
                  </label>
                  {poll.visibility && safeUsernames.find(item => item.answerid === answer.id)?.usernames.length > 0 && (
                    <div id={`username-list-${answer.id}`} className="username-list">
                      <button className="close-button" onClick={(event) => handleCloseUsernames(event, answer.id)}>X</button>
                      <p className="answer-name">{answer.answername}</p>
                      <div className="username-list-content">
                        {safeUsernames.find(item => item.answerid === answer.id)?.usernames.map((username) => (
                          <div className="username-row">
                            <img src={userImages[username]} alt={username} className="profile-pic" />
                            <p className="username">{username}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

            </div>
            {poll.type === 'opinion' && (
              <div className="input-inline">
                <input
                  type="text"
                  value={newAnswer}
                  onChange={handleNewAnswerChange}
                  placeholder="Шинэ сонголт оруулах..."
                  className="create-answer"
                />
                <button onClick={handleNewAnswerSubmit}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            )}

            {selectedAnswer && (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {hasSubmitted ? 'Сонголт шинчлэх' : 'Сонголт оруулах'}
              </button>
            )}

            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleViewResults}
            >
              Үр дүн
            </button>

            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}
          </form>


          <div className="comment-container">
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <div className="mb-4">
                <label htmlFor="comment">Сэтгэгдэл </label>
                <textarea
                  id="comment"
                  className="text-input"
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Сэтгэгдэл бичих..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Илгээх
              </button>
            </form>
            <div className="comment-list">
              <h3 className="text-lg font-bold mb-2">
                <FontAwesomeIcon icon={faComments} /> Сэтгэгдлүүд
              </h3>
              {comments.map((comment, index) => (
                <div key={index} className="mb-4 comment-item">
                  <div className="comment-profile">
                    {comment.profileImage ? (
                      <img className="comment-profile-pic" src={comment.profileImage} alt="User profile" />
                    ) : (
                      <FontAwesomeIcon icon={faUser} className="fa-user-icon" />
                    )}
                  </div>
                  <div className="comment-content">
                    <div className="comment-inline">
                      {comment.username && (
                        <div className="username">{comment.username}</div>
                      )}
                      <div className="datetime"> {formatDateTime(comment.createdAt)}</div>
                    </div>
                    <div className="comment-and-date">
                      <div className="comment">{comment.comment}</div>
                      <div className="datetime-posted text-sm text-gray-500">{comment.datetime_posted}</div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
          <div id="overlay" class="overlay"></div>
        </motion.div>
      </div>
      : "loading..."


  );

};

export default Poll;