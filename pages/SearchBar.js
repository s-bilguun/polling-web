import { useState } from 'react';
import { useRouter } from 'next/router';
import { RiSearchLine } from 'react-icons/ri';
import axios from 'axios';

const SearchBar = ({ setPolls, setNotFound, initialPolls }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
  
    if (!searchTerm) {
      // If the search input is empty, reset the polls state
      setNotFound(false);
      setPolls(initialPolls); // Set this to the original list of polls if needed
      return;
    }
  
    try {
      const response = await axios.get('http://localhost:8001/poll/search/qwertyuiop', {
        params: {
          question: searchTerm.toLowerCase(),
        }
      });
  
      if (response.status === 200) {
        const data = response.data.searchingPolls;
        if (data.length > 0) {
          setNotFound(false);
          setPolls(data);
        } else {
          setNotFound(true);
          setPolls([]);
        }
      } else {
        console.error('Failed to fetch searched polls');
        setNotFound(true); // Add this line to update the notFound state when the API call fails
        setPolls([]); // Add this line to clear the previous polls state
      }
    } catch (error) {
      console.error('Error fetching searched polls:', error);
      setNotFound(true); // Add this line to update the notFound state when there is an error
      setPolls([]); // Add this line to clear the previous polls state
    }
  
    // Redirect to search results page
    router.push(`/search?question=${searchTerm}`);
  };
  
  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* <button type="submit" className="search-icon-button">
        <RiSearchLine />
      </button> */}
    </form>
  );
};

export default SearchBar;
