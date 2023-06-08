// Page.js
import React from 'react';
import Link from 'next/link';
import Header from './Header';

const Page = () => {
  const isLoggedIn = true; // Change this based on your authentication logic
  const polls = [
    { id: 1, title: 'Poll 1', username: 'User 1', startDatetime: '2023-06-06', endDatetime: '2023-06-10' },
    { id: 2, title: 'Poll 2', username: 'User 2', startDatetime: '2023-06-07', endDatetime: '2023-06-11' },
    { id: 3, title: 'Poll 3', username: 'User 3', startDatetime: '2023-06-08', endDatetime: '2023-06-12' },
  ];

  return (
    <div>
      <Header />

      {isLoggedIn && (
        <Link href="/poll_create">
          <button className="create-poll-button">
            Create New Poll
          </button>
        </Link>
      )}

      <div className="poll-list">
        <h2>Poll Feed</h2>

        {polls.map(poll => (
          <div key={poll.id} className="poll-item">
             <Link href={`/poll/${poll.id}`} passHref>
              <div className="poll-title-link">{poll.title}</div>
            </Link>
            <p className="poll-username">Username: {poll.username}</p>
            <p className="poll-datetime">Start Datetime: {poll.startDatetime}</p>
            <p className="poll-datetime">End Datetime: {poll.endDatetime}</p>
           
          </div>
        ))}
      </div>

      {/* ... rest of your code */}
    </div>
  );
};

export default Page;
