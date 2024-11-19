import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TradingChart from '../components/TradingChart';
import { coins } from '../data/coinData';

const SpotTradingPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [selectedSymbol, setSelectedSymbol] = useState(symbol || 'BTCUSDT');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [orderType, setOrderType] = useState('limit'); // Default: Limit Order
  const [openPositions, setOpenPositions] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);

  useEffect(() => {
    if (symbol) {
      setSelectedSymbol(symbol.toUpperCase());
    }
  }, [symbol]);

  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedSymbol.toLowerCase()}@depth10`
    );
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setOrderBook({
        bids: message.bids || [],
        asks: message.asks || [],
      });
    };

    return () => ws.close();
  }, [selectedSymbol]);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCoinSelection = (newSymbol) => {
    navigate(`/spot/${newSymbol}`);
  };

  const handleTrade = (type, amount, price) => {
    const isMarketOrder = orderType === 'market';
    const tradePrice = isMarketOrder ? 'Market Price' : price;

    const newTrade = {
      id: Math.random().toString(36).substr(2, 9),
      type: type.toUpperCase(),
      amount,
      price: tradePrice,
      symbol: selectedSymbol,
      orderType,
      timestamp: new Date().toLocaleString(),
    };

    // Position eröffnen
    setOpenPositions([...openPositions, newTrade]);

    // Historie aktualisieren
    setTradeHistory([...tradeHistory, { ...newTrade, status: 'Executed' }]);

    alert(
      `${type.toUpperCase()} ${amount} ${selectedSymbol} at ${
        isMarketOrder ? 'Market Price' : `$${price}`
      }`
    );
  };

  const handleClosePosition = (id) => {
    const positionToClose = openPositions.find((position) => position.id === id);
    setOpenPositions(openPositions.filter((position) => position.id !== id));
    setTradeHistory([
      ...tradeHistory,
      { ...positionToClose, status: 'Closed', closeTime: new Date().toLocaleString() },
    ]);
    alert(`Position ${id} closed.`);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Title */}
      <h1 className="text-5xl font-bold text-neon-blue text-center mb-8">
        Spot Trading ({selectedSymbol})
      </h1>

      <div className="grid grid-cols-4 gap-6">
        {/* Coin-Auswahl */}
        <div className="bg-gray-800 p-6 rounded shadow-lg col-span-1">
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

        {/* Chart */}
        <div className="col-span-2 bg-gray-800 p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Market Chart</h2>
          <TradingChart symbol={selectedSymbol} interval="5" theme="dark" />
        </div>

        {/* Order Book */}
        <div className="bg-gray-800 p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold text-white">Order Book</h2>
          <div className="grid grid-cols-1">
            <div className="border-b border-gray-600 pb-2 mb-2">
              <h3 className="text-red-400 font-bold text-center">Asks (Sell Orders)</h3>
              <ul className="mt-2 max-h-[200px] overflow-y-auto flex flex-col-reverse">
                {orderBook.asks.map(([price, qty], index) => (
                  <li key={index} className="flex justify-between text-red-400">
                    <span>${price}</span>
                    <span>{qty}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-green-400 font-bold text-center">Bids (Buy Orders)</h3>
              <ul className="mt-2 max-h-[200px] overflow-y-auto">
                {orderBook.bids.map(([price, qty], index) => (
                  <li key={index} className="flex justify-between text-green-400">
                    <span>${price}</span>
                    <span>{qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Kaufen-/Verkaufen-Feld */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
        <h2 className="text-2xl font-bold text-neon-blue mb-4 text-center">
          Place a Trade
        </h2>

        {/* Order Type Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-6 py-2 text-lg font-bold rounded-lg ${
              orderType === 'limit'
                ? 'bg-neon-blue text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
            onClick={() => setOrderType('limit')}
          >
            Limit Order
          </button>
          <button
            className={`px-6 py-2 text-lg font-bold rounded-lg ${
              orderType === 'market'
                ? 'bg-neon-blue text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
            onClick={() => setOrderType('market')}
          >
            Market Order
          </button>
        </div>

        {orderType === 'limit' && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-900 p-6 rounded">
              <h3 className="text-xl font-bold text-green-400 mb-4 text-center">Buy Limit</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const amount = e.target.amount.value;
                  const price = e.target.price.value;
                  handleTrade('buy', amount, price);
                }}
              >
                <div className="space-y-4">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                  >
                    Place Buy Order
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-gray-900 p-6 rounded">
              <h3 className="text-xl font-bold text-red-400 mb-4 text-center">Sell Limit</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const amount = e.target.amount.value;
                  const price = e.target.price.value;
                  handleTrade('sell', amount, price);
                }}
              >
                <div className="space-y-4">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                  >
                    Place Sell Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {orderType === 'market' && (
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-900 p-6 rounded">
              <h3 className="text-xl font-bold text-green-400 mb-4 text-center">Buy Market</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const amount = e.target.amount.value;
                  handleTrade('buy', amount);
                }}
              >
                <div className="space-y-4">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
                  >
                    Place Buy Order
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-gray-900 p-6 rounded">
              <h3 className="text-xl font-bold text-red-400 mb-4 text-center">Sell Market</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const amount = e.target.amount.value;
                  handleTrade('sell', amount);
                }}
              >
                <div className="space-y-4">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                  >
                    Place Sell Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Open Positions */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
        <h2 className="text-xl font-bold text-neon-blue mb-4">Open Positions</h2>
        {openPositions.length > 0 ? (
          <ul className="space-y-4">
            {openPositions.map((position) => (
              <li
                key={position.id}
                className="flex justify-between bg-gray-900 p-4 rounded text-white"
              >
                <div>
                  <p>
                    <strong>{position.type}</strong> {position.amount} {position.symbol}
                  </p>
                  <p>Price: ${position.price}</p>
                </div>
                <button
                  onClick={() => handleClosePosition(position.id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Close
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No open positions.</p>
        )}
      </div>

      {/* Trade History */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
        <h2 className="text-xl font-bold text-neon-blue mb-4">Trade History</h2>
        {tradeHistory.length > 0 ? (
          <ul className="space-y-4">
            {tradeHistory.map((trade, index) => (
              <li key={index} className="bg-gray-900 p-4 rounded text-white">
                <p>
                  <strong>{trade.type}</strong> {trade.amount} {trade.symbol}
                </p>
                <p>Price: ${trade.price}</p>
                <p>Status: {trade.status}</p>
                <p>Time: {trade.timestamp}</p>
                {trade.status === 'Closed' && <p>Close Time: {trade.closeTime}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No trade history available.</p>
        )}
      </div>
    </div>
  );
};

export default SpotTradingPage;
