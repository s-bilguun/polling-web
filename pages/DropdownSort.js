import { useState } from 'react';

const DropdownSort = ({ options, onSelectSort }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelectSort(option);
  };

  return (
    <div className="dropdown-sort">
      <select
        value={selectedOption}
        onChange={(e) => handleSelect(e.target.value)}
        className="dropdown-sort__select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSort;