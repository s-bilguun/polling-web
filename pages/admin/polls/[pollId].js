import React from 'react';
import { useRouter } from 'next/router';

const PollPage = () => {
  const router = useRouter();
  const { pollid } = router.query;

  // Fetch poll details based on pollid and populate the poll object

  const poll = {
    id: pollid,
    question: 'What is your favorite color?',
    options: [
      { id: 1, text: 'Red', votes: 10 },
      { id: 2, text: 'Blue', votes: 15 },
      { id: 3, text: 'Green', votes: 8 },
    ],
  };

  // Function to handle deletion of the poll
  const handleDelete = () => {
    // Delete the poll logic

    // After deletion, navigate back to the admin page
    router.push('/admin');
  };

  return (
    <div>
      <h1>Poll Details</h1>
      <h2>Question: {poll.question}</h2>

      {/* Render poll options with vote counts */}
      <ul>
        {poll.options.map((option) => (
          <li key={option.id}>
            Option: {option.text}, Votes: {option.votes}
          </li>
        ))}
      </ul>

      {/* Button for deleting the poll */}
      <button onClick={handleDelete}>Delete Poll</button>
    </div>
  );
};

export default PollPage;
