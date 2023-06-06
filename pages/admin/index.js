import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AdminPage = () => {
  const polls = [
    { id: 1, question: 'What is your favorite color?' },
    { id: 2, question: 'How often do you exercise?' },
  ];

  const router = useRouter();

  const handlePollClick = (id) => {
    router.push(`/admin/polls/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Page</h1>

      <h2 className="text-2xl font-semibold mb-2">Polls</h2>
      <ul className="mb-4">
        {polls.map((poll) => (
          <li
            key={poll.id}
            className="text-blue-500 cursor-pointer"
            onClick={() => handlePollClick(poll.id)}
          >
            <Link href={`/admin/polls/${poll.id}`}>
              <div>{poll.question}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
