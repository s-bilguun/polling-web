// Page.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import SearchBar from './SearchBar';
import DropdownSort from './DropdownSort';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faArrowDownWideShort } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDateTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);
  const year = String(dateTime.getFullYear()).slice(-2); // Extract the last two digits of the year
  const month = String(dateTime.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it is zero-based
  const day = String(dateTime.getDate()).padStart(2, '0');
  const time = dateTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${year}-${month}-${day} ${time}`;
};


const Page = () => {
  const [polls, setPolls] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [initialPolls, setInitialPolls] = useState([]);
  const [profileImages, setProfileImages] = useState({});

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:8001/poll/list');

        if (response.ok) {
          const data = await response.json();
          setPolls(data);
          setInitialPolls(data); // Store the original list of polls
          setNotFound(data.length === 0); // Set notFound based on the length of the polls
          // Fetch profile images for each username
          data.forEach((poll) => fetchProfileImageByUsername(poll.username));
        } else {
          console.error('Failed to fetch polls');
        }
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();
  }, []);


  useLayoutEffect(() => {
    // Make icons visible after mounting
    const icons = document.querySelectorAll('.icon-initial');
    icons.forEach((icon) => {
      icon.style.opacity = '1';
    });
  }, []);


  const sortOptions = [
    { label: 'Шинэ', value: 'new polls' },
    { label: 'Хуучин', value: 'old polls' },
    { label: 'A to Z', value: 'aToZ' },
    { label: 'Z to A', value: 'zToA' },
    { label: 'Идэвхтэй', value: 'active polls' },
  ];

  const handleSort = (selectedOption) => {
    const sortedPolls = [...polls];

    switch (selectedOption) {
      case 'new polls':
        sortedPolls.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));
        break;
      case 'old polls':
        sortedPolls.sort((a, b) => new Date(a.startdate) - new Date(b.startdate));
        break;
      case 'aToZ':
        sortedPolls.sort((a, b) => a.question.localeCompare(b.question));
        break;
      case 'zToA':
        sortedPolls.sort((a, b) => b.question.localeCompare(a.question));
        break;
      case 'active polls':
        sortedPolls.sort((a, b) => {
          const now = new Date();
          const aIsActive = new Date(a.startdate) <= now && new Date(a.expiredate) >= now;
          const bIsActive = new Date(b.startdate) <= now && new Date(b.expiredate) >= now;

          // Sort active polls first
          if (aIsActive && !bIsActive) {
            return -1;
          }
          if (!aIsActive && bIsActive) {
            return 1;
          }

          // Sort by start date for both active and inactive polls
          return new Date(b.startdate) - new Date(a.startdate);
        });
        break;
      default:
        break;
    }

    setPolls(sortedPolls);
  };

  const router = useRouter();
  const { page } = router.query;
  const currentPage = parseInt(page, 10) || 1;

  const pollsPerPage = 10;
  const totalPages = Math.ceil(polls.length / pollsPerPage);

  const getPollsForPage = (page) => {
    const startIndex = (page - 1) * pollsPerPage;
    const endIndex = startIndex + pollsPerPage;
    return polls.slice(startIndex, endIndex);
  };


  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePageChange = (pageNumber) => {
    router.push(`/${pageNumber}`);
  };


  const fetchProfileImageByUsername = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8001/image/displayWithUsername/${username}`, {
        responseType: 'blob',
      });

      const imageUrl = URL.createObjectURL(response.data);

      // Update profile images state with the fetched image URL
      setProfileImages((prevState) => ({
        ...prevState,
        [username]: imageUrl,
      }));
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };



  return (
    <div>
      <Header />
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.75,
        }}
      >
        <div className="poll-list">
          <div className="second-header">
            <SearchBar setPolls={setPolls} setNotFound={setNotFound} initialPolls={initialPolls} />
            <div>
              Ангилах <FontAwesomeIcon icon={faArrowDownWideShort} className="icon-initial" /> <DropdownSort options={sortOptions} onSelectSort={handleSort} />
            </div>
          </div>

          {notFound ? (
            <div className="error-container">
              <p>Хайлтад таарсан санал асуулга олдсонгүй</p>
            </div>
          ) : (
            getPollsForPage(currentPage).map((poll) => (
              <div
                key={poll.id}
                className={`poll-item ${new Date(poll.startdate) > new Date() ? "not-started" : ""} ${new Date(poll.expiredate) < new Date() ? "expired" : ""}`}
              >
                <Link href={`/poll/${poll.id}`} className="poll-item-link">
                  <div className="poll-details">
                    <div className="poll-username">
                      <div className="profile-info">
                        {poll.username && profileImages[poll.username] ? (
                          <img
                            src={profileImages[poll.username]}
                            alt={`${poll.username}'s profile`}
                            className="profile-image"
                          />
                        ) : (
                          <img
                            src="path/to/your/alt/image"
                            alt={`${poll.username}'s profile`}
                            className="profile-image"
                          />
                        )}
                        <span className="username">{poll.username}</span>
                      </div>
                    </div>
                    <div className="poll-title-link">{poll.question}</div>
                  </div>
                  <div className="poll-datetime">
                    <p>{formatDateTime(poll.startdate)}</p>
                    <p>{formatDateTime(poll.expiredate)}</p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Pagination links */}
        <div className="pagination">
          {pageNumbers.map((pageNumber) => (
            <button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={pageNumber === currentPage ? "active" : ""}>
              {pageNumber}
            </button>
          ))}
        </div>
      </motion.div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Page;
