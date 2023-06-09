// Page.js
import React from 'react';
import Link from 'next/link';
import Header from './Header';

const Page = () => {
  const isLoggedIn = true; // Change this based on your authentication logic
  const polls = [
    { id: 1, title: 'Таны дуртай өнгө юу вэ?', username: 'User 1', startDatetime: '2023-06-06 05:12:00', endDatetime: '2023-06-10 05:12:00' },
    { id: 2, title: 'Poll 2', username: 'User 2', startDatetime: '2023-06-07 05:12:00', endDatetime: '023-06-11 05:12:00' },
    { id: 3, title: 'Poll 3', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
  ];

  return (
    <div>
      <Header />


      <div className="poll-list">
  <h2>Poll Feed</h2>

  {polls.map(poll => (
    <div key={poll.id} className="poll-item">
      <div className="poll-details">
        <div className="poll-username">Username: {poll.username}</div>
        <div className="poll-title-link">
          <Link href={`/poll/${poll.id}`} passHref>
            {poll.title}
          </Link>
        </div>
      </div>
      <div className="poll-datetime">
        <p>Start Datetime: {poll.startDatetime}</p>
        <p>End Datetime: {poll.endDatetime}</p>
      </div>
    </div>
  ))}
</div>

      {/* ... rest of your code */}
    </div>
  );
};

export default Page;
