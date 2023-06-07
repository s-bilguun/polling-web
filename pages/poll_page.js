import React, { useState } from 'react';
import { useRouter } from 'next/router';

const PollDetail = ({ id }) => {
  const router = useRouter();

  // Replace with your poll data logic
  const poll = {
    id,
    question: 'What is your favorite color?',
    answers: [
      { id: 1, text: 'Red' },
      { id: 2, text: 'Blue' },
      { id: 3, text: 'Green' },
    ],
  };

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { username: 'John Doe', comment: 'Lorem ipsum dolor sit amet.', date_posted: '2023-06-05' },
    { username: 'Jane Smith', comment: 'Fusce sagittis urna in diam luctus eleifend.', date_posted: '2023-06-06' },
  ]);

  const handleAnswerSelection = (answerId) => {
    setSelectedAnswer(answerId);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();

    // Perform the logic to submit the poll answer
    // ...

    // Reset the selected answer
    setSelectedAnswer('');
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    // Create a new comment object
    const newComment = {
      username: 'Current User', // Replace with the actual username of the logged-in user
      comment,
      date_posted: new Date().toISOString().split('T')[0], // Get the current date
    };

    // Add the new comment to the comments array
    setComments([...comments, newComment]);

    // Reset the comment input
    setComment('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Poll Details</h1>

      <h2 className="text-xl font-bold mb-2 poll-question">{poll.question}</h2>

      <form onSubmit={handleAnswerSubmit}>
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
      </form>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <div className="mb-4">
          <label htmlFor="comment">Comment</label>
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

      <div className="mt-8 comment-list">
        <h3 className="text-lg font-bold mb-2">Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="mb-4 comment-item">
            <div className="username font-bold">{comment.username}</div>
            <div>{comment.comment}</div>
            <div className="date-posted text-sm text-gray-500">{comment.date_posted}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollDetail;