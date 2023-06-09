import { useState } from 'react';
import { useRouter } from 'next/router';
import { RiSearchLine } from 'react-icons/ri';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();

    // Redirect to search results page
    router.push(`/search?query=${searchTerm}`);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="search-icon-button"><RiSearchLine /></button>
    </form>
  );
};

export default SearchBar;
