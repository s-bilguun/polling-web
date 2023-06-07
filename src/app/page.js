// page.js
import React from 'react';
import Link from 'next/link';

// const polls = [
//   {
//     id: 1,
//     question: 'TEST QUESTION 1 ',
//     poll_answer: ['yes', 'no'],
//     href: '/pages/poll_page.js',
//     user_fullname: 'Gerel Battsetseg',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
//   {
//     id: 2,
//     question: 'TEST QUESTION 2',
//     poll_answer: ['yes', 'no'],
//     user_fullname: 'Ariunbileg Temuujin',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
//   {
//     id: 3,
//     question: 'TEST QUESTION 3',
//     poll_answer: ['yes', 'no'],
//     user_fullname: 'Bold Erdene',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
//   {
//     id: 4,
//     question: 'TEST QUESTION 4',
//     poll_answer: ['yes', 'no'],
//     user_fullname: 'Bat Amgalan',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
//   {
//     id: 5,
//     question: 'TEST QUESTION 5',
//     poll_answer: ['yes', 'no'],
//     user_fullname: 'Bat Amgalan',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
//   {
//     id: 6,
//     question: 'TEST QUESTION 6',
//     poll_answer: ['yes', 'no'],
//     user_fullname: 'Bat Amgalan',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
// ];

// const users = [
//   {
//     userId: 1,
//     user_fullname: 'Gerel Battsetseg',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
//   {
//     userId: 2,
//     user_fullname: 'Ariunbileg Temuujin',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
//   {
//     userId: 3,
//     user_fullname: 'Bold Erdene',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
//   {
//     userId: 4,
//     user_fullname: 'Bat Amgalan',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
//   {
//     userId: 5,
//     user_fullname: 'Bat Amgalan',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },
//   {
//     userId: 6,
//     user_fullname: 'Bat Amgalan',
//     user_img: 'https://avatarfiles.alphacoders.com/194/194742.jpg',
//   },

// ];

const people = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'User',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    Question: "Style children based on their data attributes in TailwindCSS",
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'VIP',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    Question: "change the date location in tailwind CSS",
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Admin',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
    Question: "Vue's TransitionGroup doesn't changes text like expected",
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'User',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    Question: "change the date location in tailwind CSS",
  },
  {
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    role: 'User',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    Question: "import google font or local in next js with tailwind",
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Admin',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
    Question: "Are u gay?????????????????????????????????????????????",
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Admin',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
    Question: "I am deploying my website in netlify server Its successfully deploying but no images are coming",
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'User',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    Question: "change the date location in tailwind CSS",
  },
  {
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    role: 'User',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    Question: "change the date location in tailwind CSS",
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Admin',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
    Question: "change the date location in tailwind CSS",
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Admin',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
    Question: "change the date location in tailwind CSS",
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'User',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    Question: "change the date location in tailwind CSS",
  },
  {
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    role: 'User',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
    Question: "change the date location in tailwind CSS",
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Admin',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
    Question: "change the date location in tailwind CSS",
  },
]


const Page = () => {
  const isLoggedIn = true;

  return (
    <div className="container bg-gradient-to-l hover:bg-gradient-to-r">
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
          <button className="mb-4 py-2 px-4 bg-blue-600 text-black rounded">
            Create New Poll
          </button>
        </Link>
      )}
      <ul role="list" className="divide-y divide-gray-100">
        {people.map((person) => (
          <li key={person.email} className="flex justify-between gap-x-6 py-5">
            <div className="flex gap-x-4">
              <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.imageUrl} alt="" />
              <div className="min-w-0 flex-auto">
                <strong><p className="text-sm font-semibold leading-6 text-gray-200">{person.name}</p></strong>
                <p className="mt-1 truncate">{person.Question}</p>
              </div>
            </div>
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-200">{person.role}</p>
              {person.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
