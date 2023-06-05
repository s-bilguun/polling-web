// page.js
import React from 'react';
import Link from 'next/link';

const polls = [
  {
    id: 1,
    question: 'Sample Poll 1',
  },
  {
    id: 2,
    question: 'Sample Poll 2',
  },
  {
    id: 3,
    question: 'Sample Poll 3',
  },
];

const Page = () => {
  const isLoggedIn = true;

  return (
    <div className="container">
      <nav className="flex justify-end mb-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
        </ul>
      </nav>
      <h1 className="mb-4">Polls</h1>
      {isLoggedIn && (
        <Link href="/poll_create">
          <button className="mb-4 py-2 px-4 bg-blue-600 text-white rounded">
            Create New Poll
          </button>
        </Link>
      )}
      <ul>
        {polls.map((poll) => (
          <li key={poll.id} className="mb-2">
            {poll.question}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
