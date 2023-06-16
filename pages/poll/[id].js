import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../Header';
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const Poll = () => {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useContext(AuthContext);

  const [poll, setPoll] = useState();

  useEffect(() => {
    if(id){
      axios
        .get(`http://localhost:8001/poll/${id}`)
        .then(res => {
          setPoll(res.data);
        })
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.log(error.response.data.error)
        })
  }
  }, [id]);


  // replace with comment data logic
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { username: 'John Doe', comment: 'Lorem ipsum dolor sit amet.', datetime_posted: '2023-06-05 09:30:00' },
    { username: 'Jane Smith', comment: 'Fusce sagittis urna in diam luctus eleifend.', datetime_posted: '2023-06-06 14:45:00' },
  ]);

  const handleAnswerSelection = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAnswerSubmit = async  (e) => {
    e.preventDefault();

    await axios.post(`http://localhost:8001/poll/${pollid}/answer`, {
      answerId: selectedAnswer,
    }, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
      },
    });

    setSelectedAnswer('');
  };

  const handleCommentSubmit = async  (e) => {
    e.preventDefault();

    // Create a new comment object
    const newComment = {
      username: 'Current User', // Replace with the actual username of the logged-in user
      comment,
      date_posted: new Date().toISOString(),
    };

     await axios.post(`http://localhost:8001/poll/${pollid}/comments`, {
      comment: newComment,
    }, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
      },
    });

    setComments([...comments, newComment]);

    // Reset the comment input
    setComment('');
  };

  const handleViewResults = () => {
    router.push(`/poll/${pollid}/result`);
  };

  return (
    poll ?
    <div className="container">
      <Header/>
      <h1 className="text-3xl font-bold mb-4">Poll Details</h1>
      <h2 className="text-xl font-bold mb-2 poll-question">{poll.question}</h2>
      <h1 className="text-xl font-bold mb-2 poll-question">{poll.username}</h1>
      

      {/* <form onSubmit={handleAnswerSubmit}>
        <div className="mb-4">
          {poll.answers.map((answer) => (
            <div key={answer.id} className="poll-answer">
              <label>
                <input
                  type="radio"
                  name="answer"
                  value={answer.id}
                  checked={selectedAnswer === answer.id}
                  onChange={() => handleAnswerSelection(answer.id)}
                />
                {answer.text}
              </label>
            </div>
          ))}
        </div>

        {selectedAnswer && (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
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
      </form> */}
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
            <div className="datetime-posted text-sm text-gray-500">{comment.datetime_posted}</div>
          </div>
        ))}
      </div>
    </div>
    </div>
    :" asdsd"
  );
 
};

export default Poll;
