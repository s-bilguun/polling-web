import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../Header';
import axios from 'axios';

const PollChoices = ({ pollid }) => {
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

  const handlePollSubmit = async (e) => {
    e.preventDefault();

    try {
      // Submit the poll choices and poll ID to the backend
      const response = await axios.post('/polls/choices', {
        pollid,
        choices,
      });

      console.log('Poll choices submitted:', response.data);

      // Reset the form
      setChoices(['', '']);

      // Go back to the index page or any other desired page
      router.push('/');
    } catch (error) {
      console.error('Error submitting poll choices:', error);
    }
  };

  return (
    <div className="card">
      <Header />
      <h1>Poll Choices</h1>
      <form onSubmit={handlePollSubmit}>
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

export default PollChoices;
