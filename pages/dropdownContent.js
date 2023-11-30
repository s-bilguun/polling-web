import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const formatDateTime = (dateTimeString) => {
  // Your existing formatDateTime function
};

const DropdownContent = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8001/request/getRequests');
        if (response.data.success) {
          setRequests(response.data.data);
        } else {
          console.error('Failed to fetch requests');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="absolute top-16 left-4 bg-white p-4 border border-gray-300 z-50">
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.75,
        }}
      >
        <h2 className="text-lg font-bold mb-2">History Logs</h2>
        <ul>
          {requests.map((request) => (
            <li key={request.id} className="mb-2">
              <span className="font-semibold">Name:</span> {request.name} |{' '}
              <span className="font-semibold">Created Date:</span> {formatDateTime(request.createdAt)}
            </li>
          ))}
        </ul>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default DropdownContent;
