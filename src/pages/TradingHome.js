import React, { useState } from "react";
import { coins } from "../data/coinData";
import { Link } from "react-router-dom";

const TradingHome = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtert die Coins basierend auf der Sucheingabe
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-5xl font-bold text-center text-neon-blue mb-8">
        Select a Cryptocurrency to Trade
      </h1>

      {/* Suchleiste */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search for a coin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-3 rounded bg-gray-700 text-white focus:ring focus:ring-neon-blue"
        />
      </div>

      {/* Liste der Coins */}
      <div className="bg-gray-800 p-6 rounded shadow-lg max-h-[500px] overflow-y-auto">
        <ul className="space-y-4">
          {filteredCoins.map((coin) => (
            <li
              key={coin.symbol}
              className="flex justify-between items-center bg-gray-900 p-4 rounded hover:bg-gray-700 transition"
            >
              <span className="text-xl font-bold text-white">{coin.name}</span>
              <Link
                to={`/trade/${coin.symbol}`}
                className="bg-neon-blue px-6 py-2 rounded shadow hover:bg-blue-600 transition"
              >
                Trade
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TradingHome;
