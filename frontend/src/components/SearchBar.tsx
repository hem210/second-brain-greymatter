import { useState } from "react";
import { SearchIcon } from "../icons/SearchIcon";

interface SearchBarProps {
  onSearchClick: (query: string) => void;
}

export function SearchBar({ onSearchClick }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  function handleSearch() {
    onSearchClick(searchTerm);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm px-4 py-2">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="outline-none px-2 py-1 bg-transparent"
      />
      <button
        onClick={handleSearch}
        className="text-gray-600 hover:text-black"
      >
        <SearchIcon size="md" />
      </button>
    </div>
  );
}
