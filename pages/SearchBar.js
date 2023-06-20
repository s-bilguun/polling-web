import { useState } from 'react';
import { useRouter } from 'next/router';
import { RiSearchLine } from 'react-icons/ri';
import axios from 'axios';

const SearchBar = ({ setPolls }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get('http://localhost:8001/poll/search/qwertyuiop', {
        params: {
          question: searchTerm,
        }
      });

      if (response.status === 200) {
        const data = response.data.searchingPolls;
        setPolls(data); // Update the polls state in the Page component
      } else {
        console.error('Failed to fetch searched polls');
      }
    } catch (error) {
      console.error('Error fetching searched polls:', error);
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
