import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';

const AddPoll = () => {
  const [question, setQuestion] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [choices, setChoices] = useState(['', '']);

  const handleAddChoice = () => {
    setChoices([...choices, '']);
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  const router = useRouter();

  const handlePollSubmit = (e) => {
    e.preventDefault();

    // Format the date and time strings
    const startDateTimeFormatted = `${startDateTime}:00`;
    const endDateTimeFormatted = `${endDateTime}:00`;

    // Validate and submit the poll data to the backend
    // TODO: backend connect
    console.log('Poll submitted:', {
      question,
      startDateTime: startDateTimeFormatted,
      endDateTime: endDateTimeFormatted,
      choices,
    });

    // Reset the form
    setQuestion('');
    setStartDateTime('');
    setEndDateTime('');
    setChoices(['', '']);

    // Go back to the index page
    router.back();
  };

  return (
    <div class="card">
      <Header/>
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
        
        <label>
          Choices:
          {choices.map((choice, index) => (
            <div key={index}>
              <input
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddChoice}>
            Add Choice
          </button>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddPoll;
