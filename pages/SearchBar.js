import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RiSearchLine } from 'react-icons/ri';
import axios from 'axios';

const SearchBar = ({ setPolls, setNotFound, initialPolls }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchTerm) {
      setNotFound(false);
      setPolls(initialPolls);
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
        setNotFound(true);
        setPolls([]);
      }
    } catch (error) {
      console.error('Error fetching searched polls:', error);
      setNotFound(true);
      setPolls([]);
    }

    router.push(`/search?question=${searchTerm}`);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  return (
    <form>
      <input
        type="text"
        placeholder="Хайх..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;
