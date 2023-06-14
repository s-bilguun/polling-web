import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import axios from 'axios';

const AddPoll = () => {
  const [question, setQuestion] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  const router = useRouter();

  const handlePollSubmit = async (e) => {
    e.preventDefault();

    // Format the date and time strings
    const startDateTimeFormatted = `${startDateTime}:00`;
    const endDateTimeFormatted = `${endDateTime}:00`;

    try {
      // Submit the poll data to the backend
      const response = await axios.post('http://localhost:8001/polls', {
        question,
        startdate: startDateTimeFormatted,
        expiredate: endDateTimeFormatted,
      });
      const { pollid } = response.data; // Assuming the response contains the poll ID

      // Reset the form
      setQuestion('');
      setStartDateTime('');
      setEndDateTime('');

      // Navigate to the PollChoices component and pass the poll ID
      router.push({
        pathname: '/poll_choices',
        query: { pollid
         },
      });
    } catch (error) {
      console.log('Error submitting poll:', error);
    }
  };

  return (
    <div className="card">
      <Header />
      <h1>Add Poll</h1>
      <form onSubmit={handlePollSubmit}>
        <label>
          Question:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </label>
        <label>
          Start Date & Time:
          <input
            type="datetime-local"
            value={startDateTime}
            onChange={(e) => setStartDateTime(e.target.value)}
            required
          />
        </label>
        <label>
          End Date & Time:
          <input
            type="datetime-local"
            value={endDateTime}
            onChange={(e) => setEndDateTime(e.target.value)}
            required
          />
        </label>
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default AddPoll;
