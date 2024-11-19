import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TradingChart from "../components/TradingChart";
import { coins } from "../data/coinData";

const TradingPage = () => {
  const { pair } = useParams();
  const navigate = useNavigate();
  const [orderBook, setOrderBook] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tradingType, setTradingType] = useState("spot"); // "spot" oder "futures"
  const [leverage, setLeverage] = useState(1); // Futures Leverage
  const [orderType, setOrderType] = useState("limit"); // "limit" oder "market"

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:5000?pair=${pair}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "orderBook") {
        setOrderBook(message.data);
      }
    };

    return () => ws.close();
  }, [pair]);

  // Filter Coins basierend auf der Sucheingabe
  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler für die Navigation zu einem neuen Coin
  const handleCoinSelection = (symbol) => {
    navigate(`/trade/${symbol}`);
  };

  // Funktion zum Platzieren von Kauf-/Verkaufsaufträgen
  const handleTrade = (type, amount, price = "Market Price") => {
    const adjustedAmount =
      tradingType === "futures" ? (amount * leverage).toFixed(2) : amount;
    console.log(
      `${type.toUpperCase()} ${adjustedAmount} ${pair} at ${price} ${
        tradingType === "futures" ? `(x${leverage})` : ""
      }`
    );
    alert(
      `${type.toUpperCase()} ${adjustedAmount} ${pair} at ${price} ${
        tradingType === "futures" ? `(x${leverage})` : ""
      }`
    );
  };

  return (
    <div className="grid grid-cols-5 gap-6">
      {/* Linke Spalte: Suchleiste und Coin-Liste */}
      <div className="bg-gray-800 p-4 rounded shadow-lg col-span-1">
        <h2 className="text-xl font-bold text-neon-blue">Select a Coin</h2>
        <input
          type="text"
          placeholder="Search for a coin..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mt-4 p-2 rounded bg-gray-700 text-white focus:ring focus:ring-neon-blue"
        />
        <ul className="mt-4 max-h-[400px] overflow-y-auto space-y-2">
          {filteredCoins.map((coin) => (
            <li
              key={coin.symbol}
              className="flex justify-between items-center bg-gray-900 p-2 rounded hover:bg-gray-700 transition"
            >
              <span className="text-white">{coin.name}</span>
              <button
                onClick={() => handleCoinSelection(coin.symbol)}
                className="bg-neon-blue px-4 py-1 rounded text-white hover:bg-blue-600 transition"
              >
                Trade
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mittlere Spalte: Market Chart */}
      <div className="col-span-3 bg-gray-800 p-4 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Market Chart ({pair})</h1>
        <TradingChart symbol={pair} interval="5" theme="dark" />
      </div>

      {/* Rechte Spalte: Order Book */}
      <div className="bg-gray-800 p-4 rounded shadow-lg">
        <h2 className="text-xl font-bold">Order Book</h2>
        <ul className="mt-4 max-h-[400px] overflow-y-auto">
          {orderBook.map((order, index) => (
            <li
              key={index}
              className={`flex justify-between ${
                order.type === "buy" ? "text-green-400" : "text-red-400"
              }`}
            >
              <span>{order.type.toUpperCase()}</span>
              <span>{order.amount}</span>
              <span>${order.price}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Unterer Bereich: Trading-Typ Umschaltung */}
      <div className="col-span-5 bg-gray-800 p-6 rounded shadow-lg mt-6">
        <h2 className="text-xl font-bold text-neon-blue mb-4">Place a Trade</h2>

        {/* Umschalter für Spot und Futures */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              tradingType === "spot"
                ? "bg-neon-blue text-white"
                : "bg-gray-700 text-gray-400"
            }`}
            onClick={() => setTradingType("spot")}
          >
            Spot Trading
          </button>
          <button
            className={`px-4 py-2 rounded ${
              tradingType === "futures"
                ? "bg-neon-blue text-white"
                : "bg-gray-700 text-gray-400"
            }`}
            onClick={() => setTradingType("futures")}
          >
            Futures Trading
          </button>
        </div>

        {/* Spot Trading */}
        {tradingType === "spot" && (
          <div className="grid grid-cols-2 gap-4">
            {/* Spot Trading Komponente */}
            {/* Wie in vorherigen Versionen */}
          </div>
        )}

        {/* Futures Trading */}
        {tradingType === "futures" && (
          <div>
            {/* Leverage Kontrolle */}
            <div className="mb-4">
              <label className="text-white">Leverage: x{leverage}</label>
              <input
                type="range"
                min="1"
                max="100"
                value={leverage}
                onChange={(e) => setLeverage(e.target.value)}
                className="w-full mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Futures Trading Kauf/Verkauf */}
              {/* Ähnlich wie Spot, aber mit Hebel */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingPage;
