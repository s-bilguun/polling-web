import React from 'react';
import { useRouter } from 'next/router';

const Result = () => {
  const router = useRouter();
  const { id } = router.query;

  // Replace with your result data logic
  const pollResult = {
    id,
    question: 'What is your favorite color?',
    results: [
      { answer: 'Red', count: 10 },
      { answer: 'Blue', count: 15 },
      { answer: 'Green', count: 5 },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Poll Result</h1>

      <h2 className="text-xl font-bold mb-2 poll-question">{pollResult.question}</h2>

      <ul className="result-list">
        {pollResult.results.map((result, index) => (
          <li key={index} className="result-item">
            <span className="answer">{result.answer}</span>
            <span className="count">{result.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Result;
