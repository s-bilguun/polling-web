// Page.js
import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import SearchBar from './SearchBar';
import DropdownSort from './DropdownSort';

const Page = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:8001/poll/list');

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setPolls(data);
        } else {
          console.error('Failed to fetch polls');
        }
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();
  }, []);

  const sortOptions = [
    { label: 'New polls', value: 'new polls' },
    { label: 'Old polls', value: 'old polls' },
    { label: 'A to Z', value: 'aToZ' },
    { label: 'Z to A', value: 'zToA' },
  ];

  const handleSort = (selectedOption) => {
    // Perform sorting logic based on selectedOption
    console.log('Sorting by:', selectedOption);
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
  return (
    <div>
        <Header />
        <div className="poll-list">
          <div className='second-header'>
            <h2>Poll Feed</h2>
            <SearchBar />
            <div> {/* Change <p> to <div> */}
              Sort by <DropdownSort options={sortOptions} onSelectSort={handleSort} />
            </div>
          </div>
          {getPollsForPage(currentPage).map((poll) => (
            <div key={poll.id} className="poll-item">
              <div className="poll-details">
                <div className="poll-username">Username: {poll.username}</div>
                  <div className="poll-title-link">
                    <Link href={`/poll/${poll.id}`} passHref>
                      {poll.question}
                    </Link>
                  </div>
              </div>
              <div className="poll-datetime ">
                <p>Start Datetime: {poll.startdate}</p>
                <p>End Datetime: {poll.expiredate}</p>
              </div>
            </div>
          ))}
        </div>

      {/* Pagination links */}
        <div className="pagination">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={pageNumber === currentPage ? 'active' : ''}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        <Footer />
    </div>
  );
};

export default Page;
