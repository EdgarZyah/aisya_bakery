import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ value, onChange, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    className="flex items-center mb-4 bg-purewhite border border-gray-300 rounded"
  >
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="
        p-2 w-full 
        focus:outline-none 
        focus:ring-2 
        focus:ring-[var(--color-primary)] 
        focus:border-[var(--color-primary)]
        transition
      "
      placeholder="Search ..."
    />
    <button
      type="submit"
      className="ml-2 text-[var(--color-primary)] hover:text-[var(--color-secondary)] px-2"
    >
      <FaSearch />
    </button>
  </form>
);

export default SearchBar;
