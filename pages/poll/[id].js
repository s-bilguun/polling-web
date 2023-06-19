import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../Header';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
//anything
  const Poll = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);
  const [poll, setPoll] = useState();
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
  }, [id]);


  // replace with comment data logic
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [comment, setComment] = useState('');
  // const [comments, setComments] = useState([
  //   { username: 'John Doe', comment: 'Lorem ipsum dolor sit amet.', datetime_posted: '2023-06-05 09:30:00' },
  //   { username: 'Jane Smith', comment: 'Fusce sagittis urna in diam luctus eleifend.', datetime_posted: '2023-06-06 14:45:00' },
  // ]);

  const handleAnswerSelection = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
  
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
  
      setSelectedAnswer('');
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
      <h1 className="text-3xl font-bold mb-4">Poll Details</h1>
      <form onSubmit={handleAnswerSubmit}>
        <div className="mb-4">
        <p>username:{poll.username}</p>
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
            onClick={handleAnswerSubmit}>
            Submit Answer
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
          <h3 className="text-lg font-bold mb-2">Comments:</h3>
          {comments.map((comment, index) => (
            <div key={index} className="mb-4 comment-item">
              <div className="username font-bold">{comment.username}</div>
              <div>{comment.comment}</div>
              <div>{comment.createdAt}</div>
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
