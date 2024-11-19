import React, { useState } from "react";
import { coins } from "../data/coinData";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-gray-800 p-6 rounded shadow-lg">
      <input
        type="text"
        placeholder="Search for a coin..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-700 text-white p-2 rounded mb-4 focus:ring focus:ring-neon-blue"
      />
      <ul>
        {filteredCoins.map((coin, index) => (
          <li key={index} className="mb-2">
            <Link
              to={`/trade/${coin.pair}`}
              className="text-neon-blue hover:underline transition"
            >
              {coin.name} ({coin.pair})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
