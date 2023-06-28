import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../Header';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments } from '@fortawesome/free-solid-svg-icons';
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
    fetchAnswer();
    fetchComment();
    fetchAttendance();
  }, [id]);


  // replace with comment data logic
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [comment, setComment] = useState('');


  const handleAnswerSelection = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
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
        setErrorMessage('Answer updated successfully.');
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

      setErrorMessage('Successfully submitted');
      setHasSubmitted(true); // Set hasSubmitted to true

      // setSelectedAnswer('');
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setErrorMessage('You have already submitted this poll.');
      } else {
        setErrorMessage('An error occurred while submitting the poll attendance.');
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

  fetchProfileImage();


  const fetchProfileImageByUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8001/image/displayWithUsername/${username}`, {

        responseType: 'blob',
      });
      console.log('co,met', comment.username);
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


              {answers.map((answer) => (
                <div key={answer.id} className="poll-answer">
                  <label>
                    <input
                      type="radio"
                      name={answer.answername}
                      value={answer.answername}
                      checked={selectedAnswer === answer.id}
                      onChange={() => handleAnswerSelection(answer.id)}
                    />
                    <p className="poll-username">{answer.answername}</p>
                    {/* {answers.text}  */}
                  </label>
                </div>
              ))}
            </div>

            {selectedAnswer && (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {hasSubmitted ? 'Update Answer' : 'Submit Answer'}
              </button>
            )}

            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleViewResults}
            >
              View results
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
      <label htmlFor="comment">Write comment</label>
      <textarea
        id="comment"
        className="text-input"
        value={comment}
        onChange={handleCommentChange}
        placeholder="Enter your comment"
      ></textarea>
    </div>
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add Comment
    </button>
  </form>
  <div className="comment-list">
    <h3 className="text-lg font-bold mb-2">
      <FontAwesomeIcon icon={faComments} /> Comments
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

        </motion.div>
      </div>
      : "loading..."
  );

};

export default Poll;