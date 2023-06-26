import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../Header';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComments} from '@fortawesome/free-solid-svg-icons';
import Profile from '../Profile';
//anything

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
    if(id){
      axios
        .get(`http://localhost:8001/poll/${id}`)
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

    const fetchComment = async () =>{
      const response = await fetch(`http://localhost:8001/comment/${id}`);
      if(response.ok){
        const data = await response.json();
        setComments(data);
      }else{
        console.error('failed to fetch comments');
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
  
      console.log(response);
  
      // Add the newly created comment to the beginning of the comments state
      setComments((prevComments) => [response.data.commento, ...prevComments]);
  
      // Clear the comment input field
      setComment('');
    } catch (err) {
      //setErrorMessage("Comment add failed"); // Set error message
      console.log(err);
    }
  };

  const handleViewResults = () => {
    router.push(`/poll/${id}/result`);
  };

  return (
    poll ?
    <div className="container">
      <Header/>
      {/* <h1 className="text-3xl font-bold mb-4">Poll Details</h1> */}
      <form className="detial-info" onSubmit={hasSubmitted ? handleAnswerUpdate : handleAnswerSubmit}>
        <div className="mb-4">
        <p><Profile width={30} height={30} /> : {poll.username}</p>
        <h2 className="text-xl font-bold mb-2 poll-question">{poll.question}</h2>
        
        {/* <h1 className="text-xl font-bold mb-2 poll-question">{poll.startdate}</h1> 
        <h1 className="text-xl font-bold mb-2 poll-question">{poll.expiredate}</h1> */}
        
        {/* <h1 className="text-xl font-bold mb-2 poll-question">{answers}</h1> */}
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
          <h3 className="text-lg font-bold mb-2"> <FontAwesomeIcon icon={faComments} /> Comments </h3>
          {comments.map((comment, index) => (
            <div key={index} className="mb-4 comment-item">
              <div className='comment-inline'>
                <div className="username"> <FontAwesomeIcon icon={faUser} /> {comment.username}</div>
                <div className="datetime"> {formatDateTime(comment.createdAt)}</div>
              </div>
              <div className="comment">{comment.comment}</div>
              <div className="datetime-posted text-sm text-gray-500">{comment.datetime_posted}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    :"loading..."
  );
 
};

export default Poll;