// Page.js
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from './Header';
import SearchBar from './SearchBar';
import DropdownSort from './DropdownSort';
import {useState,useEffect} from "react";
// const Page = () => {
//   const router = useRouter();
//   const isLoggedIn = true;
// }

const Page = () => {
  // const router = useRouter();
  // const isLoggedIn = true; 

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   axios({
  //     url: "http://localhost:8001/poll/list",
  //     method: "GET",
  //     headers: {},
  //     data: {
  //       pollid: pollid,
  //       userid: userid,
  //       question: question,
  //       startdate: startdate,
  //       expiredate: expiredate,
  //     },
  //   })
  //     .then((res) => {
  //       console.log("Connected to pollweb 2023");
  //       login(res.data.token); // call the login function from AuthContext
  //       router.push("/");
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       setErrorMessage("Login failed. Please check email or password"); // Set error message
  //       console.log(err);
  //     });

  //   console.log("Login submitted:", { email, password });
  //   setEmail("");
  //   setPassword("");
  // };
  // Change this based on your authentication logic
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
// useEffect(()=>{
//   fetchData();
// },[]);

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
//  const fetchData = async () =>{
//   try{
//     const response = await axios.get('http://localhost:8001/poll/list');
//     setDatasets(response.data);
//   }catch(error){
//     console.error('error at fetching:', error);
//   }
//   return (
//     <div>
//       <ul>
//         {data.map((item)=>(
//           <li key = {item.id}>{item.question}</li>
//         ))}
//       </ul>
//     </div>
//    );
//  };
 
export default Page;
