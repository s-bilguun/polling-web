// Page.js
import React, {useState} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from './Header';
import SearchBar from './SearchBar';
import DropdownSort from './DropdownSort';

const Page = () => {
  const isLoggedIn = true; // Change this based on your authentication logic
  const polls = [
    { id: 1, title: 'Таны дуртай өнгө юу вэ?', username: 'User 1', startDatetime: '2023-06-06 05:12:00', endDatetime: '2023-06-10 05:12:00' },
    { id: 2, title: 'Чи юунаас хамгийн их айдаг вэ?', username: 'User 2', startDatetime: '2023-06-07 05:12:00', endDatetime: '023-06-11 05:12:00' },
    { id: 3, title: 'Өнөө орой яахийй ?', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
    { id: 4, title: 'Таны дуртай хоол юу вэ?', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
    { id: 5, title: 'Та ямар утас барьдаг вэ?', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
    { id: 6, title: 'Пиззанд дуртай юу?', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
    { id: 7, title: 'Өглөө хэдэн цагт босч байна вэ?', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
    { id: 8, title: 'Poll 8', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
    { id: 9, title: 'Poll 9', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
    { id: 10, title: 'Poll 10', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
    { id: 11, title: 'Poll 11', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
    { id: 12, title: 'Poll 12', username: 'User 3', startDatetime: '2023-06-08 05:12:00', endDatetime: '2023-06-12 05:12:00' },
    
  ];


  const [pollData, setPollData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handlePoll = (e) => {
    e.preventDefault();

    setIsLoading(true);

    axios
      .get("http://localhost:8001/poll/list", {
        params: {
          id: 1, // replace with the actual value
          userid: 1, // replace with the actual value
          tquestion: "Sample question", // replace with the actual value
          startDatetime: "2023-06-14", // replace with the actual value
          endDatetime: "2023-06-14", // replace with the actual value
        },
      })
      .then((res) => {
        setPollData(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }


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

        <div>
          <form onSubmit={handlePoll}>
            <button type="submit">Fetch Poll</button>
          </form>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {/* Render the received pollData */}
              <p>ID: {pollData.id}</p>
              <p>User ID: {pollData.userid}</p>
              <p>Question: {pollData.tquestion}</p>
              <p>Start Date Time: {pollData.startDatetime}</p>
              <p>End Date Time: {pollData.endDatetime}</p>
            </div>
          )}
          </div>

          {getPollsForPage(currentPage).map((poll) => (
            <div key={poll.id} className="poll-item">
              <div className="poll-details">
                <div className="poll-username">Username: {poll.username}</div>
                <div className="poll-title-link">
                  <Link href={`/poll/${poll.id}`} passHref>
                    {poll.title}
                  </Link>
                </div>
              </div>
              <div className="poll-datetime ">
                <p>Start Datetime: {poll.startDatetime}</p>
                <p>End Datetime: {poll.endDatetime}</p>
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
    </div>
  );
};

export default Page;
