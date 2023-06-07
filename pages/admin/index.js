import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../../src/app/admin-page.css';

const AdminPage = () => {
  const polls = [
    { id: 1, question: 'What is your favorite color?' },
    { id: 2, question: 'How often do you exercise?' },
  ];

  const router = useRouter();

  // State to store the list of registered users
  const [users, setUsers] = useState([
    { id: 1, name: 'User 1', canCreatePoll: true },
    { id: 2, name: 'User 2', canCreatePoll: false },
    { id: 3, name: 'User 3', canCreatePoll: false },
    // Add more user objects as needed
  ]);

  const handlePollClick = (id) => {
    router.push(`/admin/polls/${id}`);
  };

  const handleRemoveUser = (userId) => {
    // Logic to remove the user from the backend
    // After successful removal, update the users state
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleTogglePollCreation = (userId) => {
    // Logic to toggle the user's poll creation access in the backend
    // After successful toggle, update the users state
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, canCreatePoll: !user.canCreatePoll } : user
      )
    );
  };

  const [showUserList, setShowUserList] = useState(false);

  const handleUserManagementClick = () => {
    setShowUserList(!showUserList);
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

      {/* Button for user management */}
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded manage-users-button"
        onClick={handleUserManagementClick}
      >
        Manage Users
      </button>

      {/* List of registered users */}
      {showUserList && (
        <>
          <h2 className="text-2xl font-semibold mb-2 mt-8">Registered Users</h2>
          <ul className="mb-4">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <div>{user.name}</div>
                <div>
                  <button
                    className="text-red-500 mr-2 remove-button"
                    onClick={() => handleRemoveUser(user.id)}
                  >
                    Remove
                  </button>
                  <button
                    className={`${
                      user.canCreatePoll ? 'text-green-500' : 'text-gray-500'
                    } disable-button`}
                    onClick={() => handleTogglePollCreation(user.id)}
                  >
                    {user.canCreatePoll ? 'Disable Poll Creation' : 'Enable Poll Creation'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AdminPage;
